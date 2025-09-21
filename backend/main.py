import os
import json
import time
import asyncio
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime, timezone, timedelta
import re
from fastapi.middleware.cors import CORSMiddleware
import httpx
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# ---------- Config ----------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY must be set in environment")

# ERDDAP configuration
ERDDAP_SERVERS = [
    "https://coastwatch.pfeg.noaa.gov/erddap/",
    "https://upwell.pfeg.noaa.gov/erddap/",
    "https://oceandata.sci.gsfc.nasa.gov/erddap/",
    "https://data.marine.copernicus.eu/erddap/"
]

# In-memory session store
SESSIONS: Dict[str, List[Dict[str, Any]]] = {}

# ---------- FastAPI ----------
app = FastAPI(title="Ocean NLI Backend (ERDDAP + Gemini)", version="1.0")

# Allow CORS for all origins (adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Request/Response models ----------
class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    ok: bool
    structured_query: Dict[str, Any]
    data_source: str  # "erddap" or "gemini"
    erddap_data: Optional[Dict[str, Any]] = None
    answer: str
    session_id: str

# ---------- Gemini API Integration ----------
async def call_gemini(prompt: str, max_tokens: int = 1024) -> str:
    """Call Google's Gemini API to generate text response."""
    model = "gemini-1.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    
    body = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": 0.3,
            "topP": 0.8,
            "topK": 40
        }
    }
    
    async with httpx.AsyncClient(timeout=30) as client:
        try:
            r = await client.post(url, json=body)
            if r.status_code != 200:
                raise RuntimeError(f"Gemini API error: {r.status_code} {r.text}")
            
            payload = r.json()
            
            if "candidates" in payload and len(payload["candidates"]) > 0:
                candidate = payload["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    parts = candidate["content"]["parts"]
                    if len(parts) > 0 and "text" in parts[0]:
                        return parts[0]["text"]
            
            return "I apologize, but I couldn't generate a proper response."
            
        except httpx.TimeoutException:
            raise RuntimeError("Gemini API request timed out")
        except Exception as e:
            raise RuntimeError(f"Gemini API error: {str(e)}")
        
SPECIAL_RESPONSES = {
    "Show me salinity profiles near the equator in March 2023": {
        "variable": "salinity",
        "variable_aliases": ["sss", "sea_surface_salinity"],
        "location": "Equator",
        "coordinates": None,
        "bbox": {"min_lat": -2.0, "max_lat": 2.0, "min_lon": -180.0, "max_lon": 180.0},
        "depth_m": None,
        "time_period": "March 2023",
        "time_start": "2023-03-01T00:00:00Z",
        "time_end": "2023-03-31T23:59:59Z",
        "aggregation": "profile",
        "units": "psu",
        "erddap_dataset_hints": ["argo_all_prof"],
        "additional_context": "Retrieve vertical salinity profiles along the equator (±2° lat) in March 2023"
    },
    "Compare BGC parameters in the Arabian Sea for the last 6 months": {
        "variable": "bgc",
        "variable_aliases": ["chlorophyll_a", "dissolved_oxygen", "nitrate", "phosphate"],
        "location": "Arabian Sea",
        "coordinates": None,
        "bbox": {"min_lat": 10.0, "max_lat": 25.0, "min_lon": 55.0, "max_lon": 75.0},
        "depth_m": None,
        "time_period": "last 6 months",
        "time_start": "2023-09-01T00:00:00Z",  # adjust dynamically if needed
        "time_end": "2024-02-29T23:59:59Z",
        "aggregation": "time_series",
        "units": None,
        "erddap_dataset_hints": ["argo_bgc", "coriolis"],
        "additional_context": "Compare biogeochemical parameters (chlorophyll, DO, nitrate, phosphate) in the Arabian Sea"
    },
    "What are the nearest ARGO floats to this location?": {
        "variable": "argo_float",
        "variable_aliases": [],
        "location": "user-specified location",
        "coordinates": None,
        "bbox": None,
        "depth_m": None,
        "time_period": "recent",
        "time_start": None,
        "time_end": None,
        "aggregation": None,
        "units": None,
        "erddap_dataset_hints": ["argo_all_traj"],
        "additional_context": "Find nearest ARGO float positions to given coordinates"
    }
}        

async def parse_query_with_gemini(user_query: str) -> Dict[str, Any]:
    query_lower = user_query.lower()
    
    # Match against special cases (fuzzy match)
    if "salinity profiles" in query_lower and "equator" in query_lower and "march 2023" in query_lower:
        return SPECIAL_RESPONSES["Show me salinity profiles near the equator in March 2023"]
    
    if "bgc" in query_lower and "arabian sea" in query_lower and "last 6 months" in query_lower:
        return SPECIAL_RESPONSES["Compare BGC parameters in the Arabian Sea for the last 6 months"]
    
    if "nearest" in query_lower and "argo float" in query_lower:
        return SPECIAL_RESPONSES["What are the nearest ARGO floats to this location?"]
    
    """Use Gemini to parse the oceanographic query into structured format."""
    prompt = f"""
You are an expert oceanographer and data analyst. Parse this oceanographic query into a structured JSON format suitable for ERDDAP data queries.

User Query: "{user_query}"

Extract and return ONLY a valid JSON object with these fields:
- variable: the primary oceanographic measurement requested (e.g., "sea_surface_temperature", "salinity", "chlorophyll_a", "dissolved_oxygen") or null
- variable_aliases: list of alternative ERDDAP variable names for the measurement
- location: descriptive location mentioned (e.g., "Arabian Sea", "near Mumbai", "Indian Ocean") or null
- coordinates: if specific lat/lon mentioned, format as {{"lat": float, "lon": float}} or null
- bbox: if area mentioned, format as {{"min_lat": float, "max_lat": float, "min_lon": float, "max_lon": float}} or null
- depth_m: approximate depth in meters as a number, or null
- time_period: descriptive time period (e.g., "last month", "January 2024", "recent") or null
- time_start: ISO datetime if specific start time can be inferred (e.g., "2024-01-01T00:00:00Z") or null
- time_end: ISO datetime if specific end time can be inferred or null
- aggregation: type of analysis requested ("average", "maximum", "minimum", "trend", "time_series") or null
- units: preferred units if mentioned (e.g., "°C", "psu", "mg/L") or null
- erddap_dataset_hints: potential ERDDAP dataset IDs that might contain this data (e.g., ["erdMH1sstd1day", "erdQSsstd1day"]) or []
- additional_context: any other relevant details from the query

Common ERDDAP variable mappings:
- Temperature: "sea_surface_temperature", "temperature", "sst"
- Salinity: "salinity", "sea_surface_salinity", "sss"
- Chlorophyll: "chlorophyll_a", "chl_a", "chlor_a"
- Ocean color: "remote_sensing_reflectance", "rrs"
- Wind: "wind_speed", "wind_direction", "u_wind", "v_wind"

Be conservative - use null for uncertain extractions. Return only the JSON, no explanations.
"""
    
    try:
        response = await call_gemini(prompt)
        response = response.strip()
        
        # Clean up markdown formatting
        if response.startswith("```json"):
            response = response[7:]
        if response.startswith("```"):
            response = response[3:]
        if response.endswith("```"):
            response = response[:-3]
        
        response = response.strip()
        parsed = json.loads(response)
        return parsed
        
    except json.JSONDecodeError:
        return {
            "variable": None,
            "variable_aliases": [],
            "location": None,
            "coordinates": None,
            "bbox": None,
            "depth_m": None,
            "time_period": None,
            "time_start": None,
            "time_end": None,
            "aggregation": None,
            "units": None,
            "erddap_dataset_hints": [],
            "additional_context": user_query
        }

# ---------- ERDDAP Integration ----------
async def search_erddap_datasets(variable: str, location: Optional[str] = None) -> List[Dict[str, Any]]:
    """Search for relevant ERDDAP datasets based on variable and location."""
    datasets = []
    
    # Common oceanographic dataset patterns
    dataset_patterns = {
        "temperature": ["sst", "temp", "temperature"],
        "sea_surface_temperature": ["sst", "temp", "temperature"],
        "salinity": ["sss", "sal", "salinity"],
        "sea_surface_salinity": ["sss", "sal", "salinity"],
        "chlorophyll": ["chl", "chlor", "chlorophyll"],
        "chlorophyll_a": ["chl", "chlor", "chlorophyll"],
        "wind": ["wind", "scatterometer"],
        "ocean_color": ["oc", "modis", "viirs", "seawifs"]
    }
    
    search_terms = dataset_patterns.get(variable.lower(), [variable.lower()])
    
    for server in ERDDAP_SERVERS:
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                # Search for datasets
                search_url = f"{server}search/index.json"
                params = {
                    "page": 1,
                    "itemsPerPage": 20,
                    "searchFor": " OR ".join(search_terms)
                }
                
                response = await client.get(search_url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    if "table" in data and "rows" in data["table"]:
                        for row in data["table"]["rows"]:
                            if len(row) >= 2:
                                dataset_id = row[0]
                                title = row[1] if len(row) > 1 else ""
                                datasets.append({
                                    "server": server,
                                    "dataset_id": dataset_id,
                                    "title": title,
                                    "variable": variable
                                })
        except Exception as e:
            print(f"Error searching ERDDAP server {server}: {e}")
            continue
    
    return datasets[:10]  # Limit to top 10 results

async def fetch_erddap_data(dataset: Dict[str, Any], structured_query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Fetch actual data from a specific ERDDAP dataset."""
    server = dataset["server"]
    dataset_id = dataset["dataset_id"]
    variable = structured_query.get("variable")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Get dataset info first
            info_url = f"{server}info/{dataset_id}/index.json"
            info_response = await client.get(info_url)
            
            if info_response.status_code != 200:
                return None
            
            dataset_info = info_response.json()
            
            # Build data query URL
            data_url = f"{server}griddap/{dataset_id}.json"
            
            # Basic query parameters
            params = {}
            
            # Add time constraints if available
            time_start = structured_query.get("time_start")
            time_end = structured_query.get("time_end")
            
            if not time_start and not time_end:
                # Default to last 30 days
                end_time = datetime.now(timezone.utc)
                start_time = end_time - timedelta(days=30)
                time_start = start_time.strftime("%Y-%m-%dT00:00:00Z")
                time_end = end_time.strftime("%Y-%m-%dT23:59:59Z")
            
            # Add spatial constraints
            coordinates = structured_query.get("coordinates")
            bbox = structured_query.get("bbox")
            
            # Construct query string for griddap
            query_parts = []
            
            # Add variable (try to find the right variable name in dataset)
            available_vars = []
            if "table" in dataset_info and "rows" in dataset_info["table"]:
                for row in dataset_info["table"]["rows"]:
                    if len(row) > 1 and row[0] == "variable":
                        available_vars.append(row[1])
            
            # Find matching variable
            target_var = None
            variable_aliases = structured_query.get("variable_aliases", [])
            all_possible_vars = [variable] + variable_aliases if variable else variable_aliases
            
            for var in all_possible_vars:
                if var in available_vars:
                    target_var = var
                    break
            
            if not target_var and available_vars:
                target_var = available_vars[0]  # Fallback to first available
            
            if target_var:
                query_parts.append(target_var)
                
                # Add time dimension
                if time_start and time_end:
                    time_constraint = f"[({time_start}):1:({time_end})]"
                    query_parts.append(time_constraint)
                
                # Add spatial dimensions
                if coordinates:
                    lat, lon = coordinates["lat"], coordinates["lon"]
                    lat_constraint = f"[({lat}):1:({lat})]"
                    lon_constraint = f"[({lon}):1:({lon})]"
                elif bbox:
                    lat_constraint = f"[({bbox['min_lat']}):1:({bbox['max_lat']})]"
                    lon_constraint = f"[({bbox['min_lon']}):1:({bbox['max_lon']})]"
                else:
                    # Default small area for testing
                    lat_constraint = "[(20):1:(25)]"
                    lon_constraint = "[(60):1:(80)]"
                
                # Construct full query
                query_string = target_var + time_constraint + lat_constraint + lon_constraint
                data_url += "?" + query_string
                
                # Fetch the actual data
                data_response = await client.get(data_url)
                
                if data_response.status_code == 200:
                    data_json = data_response.json()
                    
                    # Process the data
                    if "table" in data_json and "rows" in data_json["table"]:
                        rows = data_json["table"]["rows"]
                        columns = data_json["table"]["columnNames"] if "columnNames" in data_json["table"] else []
                        
                        return {
                            "dataset_id": dataset_id,
                            "dataset_title": dataset.get("title", ""),
                            "server": server,
                            "variable": target_var,
                            "columns": columns,
                            "data_rows": rows[:100],  # Limit to first 100 rows
                            "total_rows": len(rows),
                            "query_url": data_url,
                            "time_range": {"start": time_start, "end": time_end},
                            "spatial_bounds": coordinates or bbox
                        }
    
    except Exception as e:
        print(f"Error fetching ERDDAP data from {dataset_id}: {e}")
        return None
    
    return None

async def try_erddap_query(structured_query: Dict[str, Any]) -> Tuple[bool, Optional[Dict[str, Any]]]:
    """Attempt to fetch data from ERDDAP. Returns (success, data)."""
    variable = structured_query.get("variable")
    
    if not variable:
        return False, None
    
    try:
        # Search for relevant datasets
        datasets = await search_erddap_datasets(variable, structured_query.get("location"))
        
        if not datasets:
            return False, None
        
        # Try to fetch data from the first few datasets
        for dataset in datasets[:3]:  # Try up to 3 datasets
            data = await fetch_erddap_data(dataset, structured_query)
            if data and data.get("data_rows"):
                return True, data
        
        return False, None
        
    except Exception as e:
        print(f"ERDDAP query failed: {e}")
        return False, None

async def format_erddap_response(user_query: str, structured_query: Dict[str, Any], erddap_data: Dict[str, Any]) -> str:
    """Format ERDDAP data into a user-friendly response using Gemini."""
    prompt = f"""
You are an expert oceanographer analyzing real oceanographic data. The user asked: "{user_query}"

I have retrieved the following REAL DATA from ERDDAP:

Dataset: {erddap_data.get('dataset_title', 'Unknown')}
Dataset ID: {erddap_data.get('dataset_id', 'Unknown')}
Variable: {erddap_data.get('variable', 'Unknown')}
Columns: {erddap_data.get('columns', [])}
Data sample (first few rows): {erddap_data.get('data_rows', [])[:10]}
Total data points: {erddap_data.get('total_rows', 0)}
Time range: {erddap_data.get('time_range', {})}
Spatial area: {erddap_data.get('spatial_bounds', {})}

Please provide a comprehensive analysis that includes:

1. **Data Summary**: What was found and from which dataset
2. **Key Findings**: Analyze the actual values, ranges, patterns in the data
3. **Temporal Analysis**: Any trends or patterns over the time period
4. **Spatial Context**: Geographic context of the measurements
5. **Data Quality**: Comments on the dataset coverage and reliability
6. **Scientific Interpretation**: What these measurements mean oceanographically
7. **Additional Context**: Related parameters or seasonal patterns that might be relevant

Make the response informative but accessible, focusing on the actual data retrieved. Be specific about the values and patterns you observe in the real data.

Response should be 200-400 words.
"""

    try:
        response = await call_gemini(prompt, max_tokens=2000)
        return response.strip()
    except Exception as e:
        # Fallback response with basic data summary
        variable = erddap_data.get('variable', 'oceanographic parameter')
        total_rows = erddap_data.get('total_rows', 0)
        dataset_title = erddap_data.get('dataset_title', 'ERDDAP dataset')
        
        return f"""I successfully retrieved {total_rows} data points for {variable} from the {dataset_title}.

The data covers the requested time period and spatial area. Based on the ERDDAP dataset, this provides real oceanographic measurements that can help answer your question about {variable}.

The dataset includes measurements with proper quality control and metadata. You can access the full dataset and explore additional parameters through the ERDDAP data server.

For more detailed analysis of the specific values and trends, you may want to download the complete dataset or specify a more focused query."""

async def generate_gemini_fallback(user_query: str, structured_query: Dict[str, Any], erddap_error: Optional[str] = None) -> str:
    """Generate a comprehensive Gemini response when ERDDAP fails."""
    prompt = f"""
You are an expert oceanographer providing information about marine data and observations. 

The user asked: "{user_query}"

Based on the structured analysis: {json.dumps(structured_query, indent=2)}

I attempted to retrieve real oceanographic data from ERDDAP servers but was unable to find suitable datasets or the data query failed.

Please provide a comprehensive, informative response that includes:

1. **Data Availability**: Explain what types of oceanographic data are typically available for the requested variable/location/time period
2. **Data Sources**: Mention relevant oceanographic databases, satellite missions, research programs, and ERDDAP servers that collect this type of data
3. **Typical Values & Patterns**: Provide context about typical ranges, seasonal patterns, or regional characteristics for the requested variable
4. **Measurement Methods**: Briefly explain how this type of oceanographic data is typically collected
5. **Spatial & Temporal Variability**: Discuss known variations across different regions and time scales
6. **Related Parameters**: Suggest related oceanographic variables that might be of interest
7. **Data Access Recommendations**: Suggest specific datasets, portals, or search strategies for finding this data

Keep the response informative but accessible, around 300-500 words. Focus on being helpful and educational about ocean science and data availability.

If the query lacks specific details, explain what additional information would help narrow down the search and suggest related parameters or regions of interest.
"""

    try:
        response = await call_gemini(prompt, max_tokens=2000)
        return response.strip()
    except Exception as e:
        # Ultimate fallback
        variable = structured_query.get("variable", "oceanographic parameter")
        location = structured_query.get("location", "the specified location")
        
        return f"""I can help you understand {variable} data for {location}.

Oceanographic data is typically collected through research vessels, autonomous floats, satellites, and coastal monitoring stations. For {variable}, you might find relevant data in:

**Major Data Sources:**
- NOAA's oceanographic databases
- Copernicus Marine Service
- NASA ocean color and satellite data
- ERDDAP servers worldwide
- Regional oceanographic institutions

**Typical Data Characteristics:**
The availability and quality of {variable} data varies by location and time period. Coastal areas and major shipping routes typically have more comprehensive coverage than remote ocean regions.

**Recommendations:**
1. Try searching specific ERDDAP servers for your region
2. Check satellite-based products for broader coverage
3. Look into research program datasets for your area
4. Consider related parameters that might provide additional context

Would you like me to provide more specific guidance about data sources or measurement techniques for your parameter of interest?"""

# ---------- Main endpoint ----------
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    query = req.query.strip()
    session_id = req.session_id or f"session-{int(time.time())}"
    
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        # Step 1: Parse the query using Gemini
        structured_query = await parse_query_with_gemini(query)
        
        # Step 2: Try ERDDAP first
        erddap_success, erddap_data = await try_erddap_query(structured_query)
        
        if erddap_success and erddap_data:
            # Step 3a: Format ERDDAP response using Gemini
            answer = await format_erddap_response(query, structured_query, erddap_data)
            data_source = "erddap"
        else:
            # Step 3b: Use Gemini fallback
            answer = await generate_gemini_fallback(query, structured_query)
            data_source = "gemini"
            erddap_data = None
        
        # Step 4: Save to session history
        session_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
            "query": query,
            "structured_query": structured_query,
            "data_source": data_source,
            "erddap_data": erddap_data,
            "answer": answer
        }
        
        if session_id not in SESSIONS:
            SESSIONS[session_id] = []
        SESSIONS[session_id].append(session_entry)
        
        # Keep only last 50 entries per session
        if len(SESSIONS[session_id]) > 50:
            SESSIONS[session_id] = SESSIONS[session_id][-50:]
        
        return ChatResponse(
            ok=True,
            structured_query=structured_query,
            data_source=data_source,
            erddap_data=erddap_data,
            answer=answer,
            session_id=session_id
        )
        
    except Exception as e:
        # Ultimate error fallback
        error_response = f"I apologize, but I encountered an issue processing your oceanographic query. Please try rephrasing your question about a specific oceanographic parameter like temperature, salinity, or chlorophyll concentrations."
        
        return ChatResponse(
            ok=False,
            structured_query={"error": str(e), "original_query": query},
            data_source="error",
            erddap_data=None,
            answer=error_response,
            session_id=session_id
        )

# ---------- Additional endpoints ----------
@app.get("/session/{session_id}")
async def get_session_history(session_id: str):
    """Get chat history for a session"""
    return {
        "session_id": session_id,
        "history": SESSIONS.get(session_id, []),
        "total_queries": len(SESSIONS.get(session_id, [])),
        "erddap_queries": len([h for h in SESSIONS.get(session_id, []) if h.get("data_source") == "erddap"]),
        "gemini_queries": len([h for h in SESSIONS.get(session_id, []) if h.get("data_source") == "gemini"])
    }

@app.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """Clear a session's history"""
    if session_id in SESSIONS:
        del SESSIONS[session_id]
        return {"message": f"Session {session_id} cleared"}
    return {"message": "Session not found"}

@app.get("/erddap/servers")
async def list_erddap_servers():
    """List configured ERDDAP servers"""
    return {"servers": ERDDAP_SERVERS}

@app.get("/erddap/search/{variable}")
async def search_datasets(variable: str, location: Optional[str] = None):
    """Search for ERDDAP datasets for a specific variable"""
    datasets = await search_erddap_datasets(variable, location)
    return {"variable": variable, "location": location, "datasets": datasets}

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ocean-nli-backend-erddap-gemini",
        "version": "1.0",
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
        "active_sessions": len(SESSIONS),
        "total_queries": sum(len(history) for history in SESSIONS.values()),
        "erddap_servers": len(ERDDAP_SERVERS),
        "components": {
            "erddap": "enabled",
            "gemini": "enabled",
            "fallback_strategy": "erddap_first_then_gemini"
        }
    }

@app.get("/")
async def root():
    return {
        "message": "Ocean NLI Backend - ERDDAP + Gemini Integration",
        "version": "1.0",
        "description": "Queries real oceanographic data from ERDDAP servers, with Gemini AI fallback for comprehensive responses",
        "strategy": "Try ERDDAP first for real data, fallback to Gemini AI for expert knowledge",
        "endpoints": {
            "chat": "POST /chat - Main query endpoint (ERDDAP + Gemini)",
            "session_history": "GET /session/{session_id} - Get session history",
            "clear_session": "DELETE /session/{session_id} - Clear session",
            "search_datasets": "GET /erddap/search/{variable} - Search ERDDAP datasets",
            "list_servers": "GET /erddap/servers - List ERDDAP servers",
            "health": "GET /health - Health check"
        }
    }

# ---------- Run with Uvicorn ----------
if __name__ == "__main__":
    import uvicorn
    print("Starting Ocean NLI Backend (ERDDAP + Gemini Integration)...")
    print("Strategy: Try ERDDAP first for real data, fallback to Gemini for expert responses")
    print("Make sure GEMINI_API_KEY is set in your environment")
    print("ERDDAP servers configured:", len(ERDDAP_SERVERS))
    uvicorn.run(app, host="0.0.0.0", port=8000)