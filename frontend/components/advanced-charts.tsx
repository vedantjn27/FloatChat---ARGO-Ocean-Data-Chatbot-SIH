"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  Cell,
} from "recharts"
import { TrendingUp, Waves, Thermometer, Wind, Activity, BarChart3, RadarIcon } from "lucide-react"

// Advanced oceanographic datasets
const depthProfileData = [
  { depth: 0, temperature: 25.2, salinity: 35.1, oxygen: 6.8, pressure: 0 },
  { depth: 10, temperature: 25.0, salinity: 35.2, oxygen: 6.7, pressure: 1 },
  { depth: 25, temperature: 24.5, salinity: 35.3, oxygen: 6.5, pressure: 2.5 },
  { depth: 50, temperature: 22.8, salinity: 35.5, oxygen: 5.9, pressure: 5 },
  { depth: 75, temperature: 20.1, salinity: 35.8, oxygen: 4.8, pressure: 7.5 },
  { depth: 100, temperature: 18.5, salinity: 36.0, oxygen: 4.2, pressure: 10 },
  { depth: 150, temperature: 15.2, salinity: 36.2, oxygen: 3.5, pressure: 15 },
  { depth: 200, temperature: 12.8, salinity: 36.3, oxygen: 3.1, pressure: 20 },
  { depth: 300, temperature: 9.5, salinity: 36.1, oxygen: 2.8, pressure: 30 },
  { depth: 500, temperature: 6.2, salinity: 35.8, oxygen: 2.5, pressure: 50 },
]

const seasonalTrendsData = [
  { month: "Jan", temperature: 24.1, salinity: 35.2, chlorophyll: 0.8, productivity: 65 },
  { month: "Feb", temperature: 24.8, salinity: 35.1, chlorophyll: 1.2, productivity: 78 },
  { month: "Mar", temperature: 26.2, salinity: 34.9, chlorophyll: 1.8, productivity: 92 },
  { month: "Apr", temperature: 27.5, salinity: 34.7, chlorophyll: 2.1, productivity: 95 },
  { month: "May", temperature: 28.1, salinity: 34.8, chlorophyll: 1.9, productivity: 88 },
  { month: "Jun", temperature: 28.8, salinity: 35.0, chlorophyll: 1.4, productivity: 72 },
  { month: "Jul", temperature: 29.2, salinity: 35.2, chlorophyll: 1.0, productivity: 58 },
  { month: "Aug", temperature: 29.0, salinity: 35.3, chlorophyll: 0.9, productivity: 55 },
  { month: "Sep", temperature: 28.3, salinity: 35.1, chlorophyll: 1.1, productivity: 68 },
  { month: "Oct", temperature: 27.1, salinity: 34.9, chlorophyll: 1.5, productivity: 82 },
  { month: "Nov", temperature: 25.8, salinity: 35.0, chlorophyll: 1.3, productivity: 75 },
  { month: "Dec", temperature: 24.6, salinity: 35.1, chlorophyll: 0.9, productivity: 62 },
]

const oceanBasinComparison = [
  { basin: "Atlantic", temperature: 18.5, salinity: 35.2, productivity: 78, coverage: 92 },
  { basin: "Pacific", temperature: 19.1, salinity: 34.8, productivity: 65, coverage: 89 },
  { basin: "Indian", temperature: 21.3, salinity: 35.0, productivity: 82, coverage: 76 },
  { basin: "Arctic", temperature: 2.8, salinity: 32.1, productivity: 45, coverage: 45 },
  { basin: "Southern", temperature: 8.2, salinity: 34.5, productivity: 88, coverage: 67 },
]

const waterMassAnalysis = [
  { name: "Surface Water", temperature: 25, salinity: 35, size: 2400, category: "surface" },
  { name: "Thermocline", temperature: 15, salinity: 35.5, size: 1800, category: "intermediate" },
  { name: "Deep Water", temperature: 4, salinity: 34.8, size: 3200, category: "deep" },
  { name: "Bottom Water", temperature: 2, salinity: 34.7, size: 1600, category: "bottom" },
]

const dataQualityMetrics = [
  { parameter: "Temperature", accuracy: 95, precision: 92, coverage: 89, timeliness: 96 },
  { parameter: "Salinity", accuracy: 93, precision: 90, coverage: 85, timeliness: 94 },
  { parameter: "Oxygen", accuracy: 88, precision: 85, coverage: 72, timeliness: 91 },
  { parameter: "Chlorophyll", accuracy: 82, precision: 78, coverage: 68, timeliness: 88 },
  { parameter: "Currents", accuracy: 79, precision: 75, coverage: 55, timeliness: 85 },
]

const COLORS = ["#0891b2", "#1e3a8a", "#f97316", "#10b981", "#eab308", "#8b5cf6"]

export function AdvancedCharts() {
  const [selectedChart, setSelectedChart] = useState("depth-profile")
  const [selectedParameter, setSelectedParameter] = useState("temperature")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Advanced Data Visualization</h2>
          <p className="text-muted-foreground">Comprehensive oceanographic data analysis and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedChart} onValueChange={setSelectedChart}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="depth-profile">Depth Profiles</SelectItem>
              <SelectItem value="seasonal-trends">Seasonal Trends</SelectItem>
              <SelectItem value="basin-comparison">Basin Comparison</SelectItem>
              <SelectItem value="water-mass">Water Mass Analysis</SelectItem>
              <SelectItem value="data-quality">Data Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={selectedChart} onValueChange={setSelectedChart} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          <TabsTrigger value="depth-profile" className="gap-2">
            <Activity className="w-4 h-4" />
            Depth Profiles
          </TabsTrigger>
          <TabsTrigger value="seasonal-trends" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Seasonal Trends
          </TabsTrigger>
          <TabsTrigger value="basin-comparison" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Basin Comparison
          </TabsTrigger>
          <TabsTrigger value="water-mass" className="gap-2">
            <Waves className="w-4 h-4" />
            Water Mass
          </TabsTrigger>
          <TabsTrigger value="data-quality" className="gap-2">
            <RadarIcon className="w-4 h-4" />
            Data Quality
          </TabsTrigger>
        </TabsList>

        <TabsContent value="depth-profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-primary" />
                  Temperature & Salinity Profile
                </CardTitle>
                <CardDescription>Vertical distribution of temperature and salinity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={depthProfileData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="temperature" type="number" domain={[0, 30]} />
                      <YAxis
                        dataKey="depth"
                        type="number"
                        domain={[0, 500]}
                        reversed={true}
                        label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          `${value}${name === "temperature" ? "°C" : name === "salinity" ? " PSU" : name === "oxygen" ? " mg/L" : " dbar"}`,
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#0891b2"
                        strokeWidth={3}
                        dot={{ fill: "#0891b2", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="salinity"
                        stroke="#1e3a8a"
                        strokeWidth={3}
                        dot={{ fill: "#1e3a8a", strokeWidth: 2, r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-primary" />
                  Oxygen & Pressure Profile
                </CardTitle>
                <CardDescription>Dissolved oxygen and pressure distribution with depth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={depthProfileData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="oxygen" type="number" domain={[0, 8]} />
                      <YAxis
                        dataKey="depth"
                        type="number"
                        domain={[0, 500]}
                        reversed={true}
                        label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        formatter={(value: any, name: string) => [
                          `${value}${name === "oxygen" ? " mg/L" : " dbar"}`,
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="oxygen"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Bar dataKey="pressure" fill="#f97316" opacity={0.6} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seasonal-trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Annual Seasonal Patterns
              </CardTitle>
              <CardDescription>Monthly variations in key oceanographic parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={seasonalTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="productivity" fill="#10b981" opacity={0.6} name="Productivity Index" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#0891b2"
                      strokeWidth={3}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="chlorophyll"
                      stroke="#eab308"
                      strokeWidth={3}
                      name="Chlorophyll (mg/m³)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="salinity"
                      stroke="#1e3a8a"
                      fill="#1e3a8a"
                      fillOpacity={0.1}
                      name="Salinity (PSU)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="basin-comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Ocean Basin Characteristics
              </CardTitle>
              <CardDescription>Comparative analysis across major ocean basins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={oceanBasinComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="temperature" type="number" domain={[0, 25]} name="Temperature" unit="°C" />
                    <YAxis dataKey="salinity" type="number" domain={[30, 36]} name="Salinity" unit="PSU" />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.basin} Ocean</p>
                              <p className="text-sm">Temperature: {data.temperature}°C</p>
                              <p className="text-sm">Salinity: {data.salinity} PSU</p>
                              <p className="text-sm">Productivity: {data.productivity}%</p>
                              <p className="text-sm">Coverage: {data.coverage}%</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Scatter dataKey="productivity" fill="#0891b2" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water-mass" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-primary" />
                Water Mass Distribution
              </CardTitle>
              <CardDescription>Temperature-Salinity characteristics of different water masses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap data={waterMassAnalysis} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#0891b2">
                    {waterMassAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Treemap>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {waterMassAnalysis.map((mass, index) => (
                  <div key={mass.name} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <p className="font-medium text-sm">{mass.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mass.temperature}°C, {mass.salinity} PSU
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RadarIcon className="w-5 h-5 text-primary" />
                Data Quality Assessment
              </CardTitle>
              <CardDescription>Quality metrics across different oceanographic parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dataQualityMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="parameter" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Accuracy"
                      dataKey="accuracy"
                      stroke="#0891b2"
                      fill="#0891b2"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Precision"
                      dataKey="precision"
                      stroke="#1e3a8a"
                      fill="#1e3a8a"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Coverage"
                      dataKey="coverage"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Timeliness"
                      dataKey="timeliness"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
