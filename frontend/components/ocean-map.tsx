"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Layers,
  Thermometer,
  Droplets,
  Leaf,
  Wind,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Download,
  Info,
} from "lucide-react"

// Mock ARGO float data
const argoFloats = [
  { id: "5904471", lat: 15.2, lon: 68.5, temperature: 28.5, salinity: 35.2, age: 2, status: "active", type: "Core" },
  { id: "2902746", lat: 18.7, lon: 72.1, temperature: 27.8, salinity: 35.4, age: 5, status: "active", type: "BGC" },
  { id: "2902123", lat: 12.4, lon: 65.8, temperature: 29.1, salinity: 35.0, age: 1, status: "active", type: "Core" },
  { id: "5905072", lat: 20.1, lon: 70.3, temperature: 26.9, salinity: 35.6, age: 8, status: "active", type: "Deep" },
  { id: "2902891", lat: 16.8, lon: 69.2, temperature: 28.2, salinity: 35.3, age: 3, status: "active", type: "BGC" },
  { id: "5904123", lat: 14.5, lon: 67.1, temperature: 29.3, salinity: 34.9, age: 1, status: "active", type: "Core" },
  { id: "2902456", lat: 19.3, lon: 71.7, temperature: 27.1, salinity: 35.5, age: 6, status: "active", type: "Core" },
  { id: "5905234", lat: 13.2, lon: 66.4, temperature: 28.8, salinity: 35.1, age: 4, status: "active", type: "Deep" },
  { id: "2902789", lat: 17.6, lon: 68.9, temperature: 27.5, salinity: 35.4, age: 7, status: "active", type: "BGC" },
  { id: "5904567", lat: 21.4, lon: 73.2, temperature: 26.3, salinity: 35.7, age: 2, status: "active", type: "Core" },
]

// Mock satellite data layers
const satelliteData = [
  { lat: 15, lon: 68, sst: 28.5, chlorophyll: 0.8, salinity: 35.2 },
  { lat: 16, lon: 69, sst: 28.2, chlorophyll: 1.2, salinity: 35.1 },
  { lat: 17, lon: 70, sst: 27.8, chlorophyll: 0.6, salinity: 35.3 },
  { lat: 18, lon: 71, sst: 27.5, chlorophyll: 1.5, salinity: 35.0 },
  { lat: 19, lon: 72, sst: 27.1, chlorophyll: 0.9, salinity: 35.4 },
  { lat: 20, lon: 73, sst: 26.8, chlorophyll: 1.1, salinity: 35.2 },
]

export function OceanMap() {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null)
  const [mapLayer, setMapLayer] = useState("temperature")
  const [showFloats, setShowFloats] = useState(true)
  const [showSatellite, setShowSatellite] = useState(true)
  const [timeAnimation, setTimeAnimation] = useState(false)
  const [depthLevel, setDepthLevel] = useState([0])
  const [zoomLevel, setZoomLevel] = useState(6)
  const [mapCenter, setMapCenter] = useState({ lat: 17, lon: 70 })

  const getFloatColor = (float: any) => {
    switch (mapLayer) {
      case "temperature":
        return float.temperature > 28 ? "#f97316" : float.temperature > 26 ? "#eab308" : "#0891b2"
      case "salinity":
        return float.salinity > 35.4 ? "#1e3a8a" : float.salinity > 35.2 ? "#0891b2" : "#10b981"
      case "age":
        return float.age < 3 ? "#10b981" : float.age < 6 ? "#eab308" : "#f97316"
      default:
        return "#0891b2"
    }
  }

  const getFloatSize = (float: any) => {
    return float.type === "Deep" ? 12 : float.type === "BGC" ? 10 : 8
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={mapLayer} onValueChange={setMapLayer}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select layer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperature">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Sea Surface Temperature
                </div>
              </SelectItem>
              <SelectItem value="salinity">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Salinity
                </div>
              </SelectItem>
              <SelectItem value="chlorophyll">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Chlorophyll-a
                </div>
              </SelectItem>
              <SelectItem value="age">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Float Age
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch id="show-floats" checked={showFloats} onCheckedChange={setShowFloats} />
            <Label htmlFor="show-floats" className="text-sm">
              ARGO Floats
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="show-satellite" checked={showSatellite} onCheckedChange={setShowSatellite} />
            <Label htmlFor="show-satellite" className="text-sm">
              Satellite Data
            </Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeAnimation(!timeAnimation)}>
            {timeAnimation ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Animate
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Interactive Ocean Map
                  </CardTitle>
                  <CardDescription>Arabian Sea region showing ARGO floats and oceanographic data</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mock Map Display */}
              <div className="relative h-96 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border overflow-hidden">
                {/* Ocean Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/30" />

                {/* Coastline representation */}
                <div className="absolute top-4 right-8 w-16 h-24 bg-amber-200 dark:bg-amber-800 rounded-sm opacity-60" />
                <div className="absolute bottom-8 left-12 w-20 h-16 bg-amber-200 dark:bg-amber-800 rounded-sm opacity-60" />

                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* ARGO Floats */}
                {showFloats &&
                  argoFloats.map((float, index) => {
                    const x = ((float.lon - 65) / 10) * 100
                    const y = ((20 - float.lat) / 10) * 100

                    return (
                      <div
                        key={float.id}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                        style={{
                          left: `${Math.max(5, Math.min(95, x))}%`,
                          top: `${Math.max(5, Math.min(95, y))}%`,
                        }}
                        onClick={() => setSelectedFloat(selectedFloat === float.id ? null : float.id)}
                      >
                        <div
                          className="rounded-full border-2 border-white shadow-lg"
                          style={{
                            backgroundColor: getFloatColor(float),
                            width: `${getFloatSize(float)}px`,
                            height: `${getFloatSize(float)}px`,
                          }}
                        />
                        {selectedFloat === float.id && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background border rounded-lg p-2 shadow-lg z-10 min-w-48">
                            <div className="text-sm font-medium">Float {float.id}</div>
                            <div className="text-xs text-muted-foreground space-y-1 mt-1">
                              <div>Type: {float.type}</div>
                              <div>Temperature: {float.temperature}°C</div>
                              <div>Salinity: {float.salinity} PSU</div>
                              <div>Age: {float.age} days</div>
                              <div>
                                Position: {float.lat.toFixed(2)}°N, {float.lon.toFixed(2)}°E
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                {/* Satellite Data Overlay */}
                {showSatellite &&
                  satelliteData.map((point, index) => {
                    const x = ((point.lon - 65) / 10) * 100
                    const y = ((20 - point.lat) / 10) * 100

                    return (
                      <div
                        key={index}
                        className="absolute opacity-30"
                        style={{
                          left: `${Math.max(0, Math.min(90, x))}%`,
                          top: `${Math.max(0, Math.min(90, y))}%`,
                          width: "10%",
                          height: "10%",
                          background: `radial-gradient(circle, ${
                            mapLayer === "temperature"
                              ? point.sst > 28
                                ? "#f97316"
                                : "#0891b2"
                              : mapLayer === "chlorophyll"
                                ? point.chlorophyll > 1
                                  ? "#10b981"
                                  : "#eab308"
                                : "#1e3a8a"
                          }40 0%, transparent 70%)`,
                        }}
                      />
                    )
                  })}

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                  <div className="text-xs font-medium mb-2">
                    {mapLayer === "temperature" && "Temperature (°C)"}
                    {mapLayer === "salinity" && "Salinity (PSU)"}
                    {mapLayer === "chlorophyll" && "Chlorophyll-a (mg/m³)"}
                    {mapLayer === "age" && "Float Age (days)"}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span>High</span>
                    </div>
                  </div>
                </div>

                {/* Coordinates Display */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
                  <div className="text-xs font-mono">
                    {mapCenter.lat.toFixed(2)}°N, {mapCenter.lon.toFixed(2)}°E
                  </div>
                  <div className="text-xs text-muted-foreground">Zoom: {zoomLevel}x</div>
                </div>
              </div>

              {/* Depth Control */}
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">Depth Level: {depthLevel[0]}m</Label>
                <Slider value={depthLevel} onValueChange={setDepthLevel} max={2000} step={10} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Surface</span>
                  <span>500m</span>
                  <span>1000m</span>
                  <span>2000m</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Info Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="w-4 h-4" />
                Map Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Active Floats</span>
                <Badge variant="secondary">{argoFloats.length}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Data Points</span>
                <Badge variant="secondary">2,847</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Coverage Area</span>
                <Badge variant="secondary">Arabian Sea</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Update</span>
                <Badge variant="outline">2h ago</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Float Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Core ARGO</span>
                </div>
                <span className="text-sm font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm">BGC ARGO</span>
                </div>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm">Deep ARGO</span>
                </div>
                <span className="text-sm font-medium">2</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-sm font-medium">27.8°C</div>
                  <div className="text-xs text-muted-foreground">Avg Temperature</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">35.3 PSU</div>
                  <div className="text-xs text-muted-foreground">Avg Salinity</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">12 kt</div>
                  <div className="text-xs text-muted-foreground">Wind Speed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
