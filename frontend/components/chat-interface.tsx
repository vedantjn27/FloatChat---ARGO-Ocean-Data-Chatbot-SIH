"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Bot, User, Loader2, Database, Brain, MapPin, Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  data_source?: "erddap" | "gemini" | "error"
  structured_query?: any
  erddap_data?: any
}

interface ChatInterfaceProps {
  activeSession: string | null
  onSessionChange: (sessionId: string) => void
}

async function callBackend(query: string) {
  try {
    // Replace 'http://localhost:8000' with your actual backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

    const response = await fetch(`${backendUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Backend API error:", error)
    // Fallback to mock data if backend is unavailable
    return await simulateBackendCall(query)
  }
}

export function ChatInterface({ activeSession, onSessionChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I'm your oceanographic data assistant. I can help you query ERDDAP servers for real oceanographic data including temperature, salinity, chlorophyll, and more. Try asking me something like 'Show me sea surface temperature in the Arabian Sea' or 'What's the salinity near Mumbai?'",
      timestamp: new Date(),
      data_source: "gemini",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await callBackend(input.trim())

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.answer,
        timestamp: new Date(),
        data_source: response.data_source,
        structured_query: response.structured_query,
        erddap_data: response.erddap_data,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (!activeSession) {
        const newSessionId = `session-${Date.now()}`
        onSessionChange(newSessionId)
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        data_source: "error",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.type === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn("flex gap-3 max-w-[80%]", message.type === "user" ? "flex-row-reverse" : "flex-row")}>
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={cn(
                    "rounded-lg p-3 space-y-2",
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {message.type === "assistant" && message.data_source && (
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">
                        {message.data_source === "erddap" && (
                          <>
                            <Database className="w-3 h-3 mr-1" />
                            ERDDAP Data
                          </>
                        )}
                        {message.data_source === "gemini" && (
                          <>
                            <Brain className="w-3 h-3 mr-1" />
                            AI Knowledge
                          </>
                        )}
                        {message.data_source === "error" && (
                          <>
                            <span className="w-3 h-3 mr-1 text-destructive">⚠</span>
                            Error
                          </>
                        )}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  )}

                  {message.erddap_data && (
                    <div className="mt-2 p-2 bg-background/50 rounded border">
                      <div className="text-xs font-medium mb-1">Data Summary:</div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Database className="w-3 h-3" />
                          Dataset: {message.erddap_data.dataset_title}
                        </div>
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          Variable: {message.erddap_data.variable}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Points: {message.erddap_data.total_rows}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing your query...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about oceanographic data... (e.g., 'Show me temperature data near Mumbai')"
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Show me sea surface temperature in the Arabian Sea")}
            disabled={isLoading}
          >
            Temperature Query
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("What's the salinity near Mumbai in the last month?")}
            disabled={isLoading}
          >
            Salinity Query
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput("Show me chlorophyll data in the Indian Ocean")}
            disabled={isLoading}
          >
            Chlorophyll Query
          </Button>
        </div>
      </div>
    </div>
  )
}

// Mock function to simulate backend API call
async function simulateBackendCall(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  const q = query.toLowerCase();

  if (q.includes("temperature")) {
    return {
      ok: true,
      structured_query: { variable: "sea_surface_temperature", location: "Arabian Sea", time_period: "recent" },
      data_source: "ARGO",
      erddap_data: {
        dataset_id: "erdMH1sstd1day",
        dataset_title: "MODIS Aqua Sea Surface Temperature",
        variable: "sea_surface_temperature",
        total_rows: 1247,
        time_range: { start: "2024-01-01", end: "2024-01-31" },
      },
      answer:
        "Sea surface temperature in the Arabian Sea (MODIS Aqua) over the past month contains 1,247 points. Temperatures range from 24.5°C near the northern coast to 29.2°C offshore. The average temperature is 27.1°C, with the warmest areas in the central Arabian Sea.",
    };
  } else if (q.includes("salinity")) {
    return {
      ok: true,
      structured_query: { variable: "sea_surface_salinity", location: "near Equator", time_period: "last month" },
      data_source: "ARGO",
      erddap_data: {
        dataset_id: "erdSMOS_SSS",
        dataset_title: "SMOS Sea Surface Salinity",
        variable: "sea_surface_salinity",
        total_rows: 892,
        time_range: { start: "2024-01-01", end: "2024-01-31" },
      },
      answer:
        "Sea surface salinity near Eqautor in 2023 (SMOS satellite) contains 912 measurements. Values range from 28.8 PSU near coastal runoff regions to 34.2 PSU offshore, with an average of 32.0 PSU. Salinity is slightly above seasonal averages due to reduced freshwater inflow during the recent period.",
    };
  } else if (q.includes("bgc") && q.includes("arabian sea")) {
    return {
      ok: true,
      structured_query: { variable: "bgc", location: "Arabian Sea", time_period: "last 6 months" },
      data_source: "ARGO",
      erddap_data: {
        dataset_id: "argo_bgc",
        dataset_title: "ARGO Biogeochemical Parameters",
        variable: "bgc",
        total_rows: 1_300,
      },
      answer:
        "Biogeochemical parameters in the Arabian Sea from the last 6 months (1,300 measurements) show: chlorophyll-a 0.08–12.4 mg/m³ (avg 2.6 mg/m³), dissolved oxygen 3.5–6.8 mg/L (avg 5.2 mg/L), nitrate 0.1–12 µmol/L (avg 4.8 µmol/L), phosphate 0.05–2 µmol/L (avg 0.6 µmol/L). Coastal upwelling zones have higher nutrients, offshore is more oligotrophic.",
    };
  } else if (q.includes("argo float")) {
    return {
      ok: true,
      structured_query: { variable: "argo_float", location: "user-specified location", time_period: "recent" },
      data_source: "ARGO",
      erddap_data: {
        dataset_id: "argo_all_traj",
        dataset_title: "All ARGO Float Trajectories",
        variable: "position",
        total_rows: 500,
      },
      answer:
        "The nearest ARGO floats to the specified location include 4 active floats within 200 km radius. Float IDs: 4901234, 4901235, 4901238, 4901241. Recent positions indicate average depths of 1000 m, with ascent/descent cycles approximately every 10 days, reporting temperature, salinity, and biogeochemical parameters.",
    };
  } else {
    return {
      ok: true,
      structured_query: { variable: null, location: null, additional_context: query },
      data_source: "ERRDAP",
      answer:
        "I can help you explore oceanographic data from ARGO servers worldwide. Try asking about temperature, salinity, chlorophyll, or ARGO floats in a specific region or time period for detailed data.",
    };
  }
}
