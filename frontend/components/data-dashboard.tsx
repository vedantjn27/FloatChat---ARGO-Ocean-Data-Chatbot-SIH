"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Thermometer,
  Droplets,
  Leaf,
  Activity,
  Globe,
  Database,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"

// Mock data for oceanographic measurements
const temperatureData = [
  { date: "2024-01-01", surface: 24.5, depth_50m: 22.1, depth_100m: 19.8, depth_200m: 16.2 },
  { date: "2024-01-02", surface: 24.8, depth_50m: 22.3, depth_100m: 20.1, depth_200m: 16.5 },
  { date: "2024-01-03", surface: 25.1, depth_50m: 22.6, depth_100m: 20.3, depth_200m: 16.8 },
  { date: "2024-01-04", surface: 25.3, depth_50m: 22.8, depth_100m: 20.5, depth_200m: 17.0 },
  { date: "2024-01-05", surface: 25.0, depth_50m: 22.5, depth_100m: 20.2, depth_200m: 16.7 },
  { date: "2024-01-06", surface: 24.7, depth_50m: 22.2, depth_100m: 19.9, depth_200m: 16.4 },
  { date: "2024-01-07", surface: 24.9, depth_50m: 22.4, depth_100m: 20.0, depth_200m: 16.6 },
]

const salinityData = [
  { date: "2024-01-01", surface: 35.2, depth_50m: 35.4, depth_100m: 35.6, depth_200m: 35.8 },
  { date: "2024-01-02", surface: 35.1, depth_50m: 35.3, depth_100m: 35.5, depth_200m: 35.7 },
  { date: "2024-01-03", surface: 35.3, depth_50m: 35.5, depth_100m: 35.7, depth_200m: 35.9 },
  { date: "2024-01-04", surface: 35.4, depth_50m: 35.6, depth_100m: 35.8, depth_200m: 36.0 },
  { date: "2024-01-05", surface: 35.2, depth_50m: 35.4, depth_100m: 35.6, depth_200m: 35.8 },
  { date: "2024-01-06", surface: 35.0, depth_50m: 35.2, depth_100m: 35.4, depth_200m: 35.6 },
  { date: "2024-01-07", surface: 35.1, depth_50m: 35.3, depth_100m: 35.5, depth_200m: 35.7 },
]

const chlorophyllData = [
  { date: "2024-01-01", concentration: 0.8, region: "Coastal", productivity: "High" },
  { date: "2024-01-02", concentration: 1.2, region: "Coastal", productivity: "High" },
  { date: "2024-01-03", concentration: 0.6, region: "Open Ocean", productivity: "Medium" },
  { date: "2024-01-04", concentration: 0.4, region: "Open Ocean", productivity: "Low" },
  { date: "2024-01-05", concentration: 1.5, region: "Upwelling", productivity: "Very High" },
  { date: "2024-01-06", concentration: 0.9, region: "Coastal", productivity: "High" },
  { date: "2024-01-07", concentration: 0.7, region: "Open Ocean", productivity: "Medium" },
]

const floatDistribution = [
  { region: "North Atlantic", count: 847, percentage: 22 },
  { region: "South Atlantic", count: 623, percentage: 16 },
  { region: "North Pacific", count: 1245, percentage: 32 },
  { region: "South Pacific", count: 734, percentage: 19 },
  { region: "Indian Ocean", count: 398, percentage: 11 },
]

const COLORS = ["#0891b2", "#1e3a8a", "#f97316", "#10b981", "#eab308"]

export function DataDashboard() {
  const [selectedParameter, setSelectedParameter] = useState("temperature")
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [selectedRegion, setSelectedRegion] = useState("global")

  const getCurrentData = () => {
    switch (selectedParameter) {
      case "temperature":
        return temperatureData
      case "salinity":
        return salinityData
      case "chlorophyll":
        return chlorophyllData
      default:
        return temperatureData
    }
  }

  const getParameterInfo = () => {
    switch (selectedParameter) {
      case "temperature":
        return {
          icon: Thermometer,
          unit: "°C",
          color: "#0891b2",
          description: "Sea surface and depth temperature measurements",
        }
      case "salinity":
        return {
          icon: Droplets,
          unit: "PSU",
          color: "#1e3a8a",
          description: "Practical Salinity Units across depth profiles",
        }
      case "chlorophyll":
        return {
          icon: Leaf,
          unit: "mg/m³",
          color: "#10b981",
          description: "Chlorophyll-a concentration indicating phytoplankton activity",
        }
      default:
        return {
          icon: Activity,
          unit: "",
          color: "#0891b2",
          description: "Oceanographic measurements",
        }
    }
  }

  const parameterInfo = getParameterInfo()
  const IconComponent = parameterInfo.icon

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={selectedParameter} onValueChange={setSelectedParameter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select parameter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="temperature">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Temperature
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
            </SelectContent>
          </Select>

          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="atlantic">Atlantic</SelectItem>
              <SelectItem value="pacific">Pacific</SelectItem>
              <SelectItem value="indian">Indian Ocean</SelectItem>
              <SelectItem value="arctic">Arctic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Parameter Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="w-5 h-5" style={{ color: parameterInfo.color }} />
            {selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)} Overview
          </CardTitle>
          <CardDescription>{parameterInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Current Average</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: parameterInfo.color }}>
                  {selectedParameter === "temperature" ? "24.9" : selectedParameter === "salinity" ? "35.2" : "0.8"}
                </span>
                <span className="text-sm text-muted-foreground">{parameterInfo.unit}</span>
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.1%
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Data Quality</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Quality Score</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Coverage</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Spatial Coverage</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">2 hours ago</span>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Time Series Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Time Series Analysis</CardTitle>
            <CardDescription>
              {selectedParameter.charAt(0).toUpperCase() + selectedParameter.slice(1)} measurements over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedParameter === "temperature" || selectedParameter === "salinity" ? (
                  <LineChart data={getCurrentData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any, name: string) => [
                        `${value} ${parameterInfo.unit}`,
                        name.replace("_", " ").replace("depth ", "").replace("m", "m depth"),
                      ]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="surface" stroke="#0891b2" strokeWidth={2} name="Surface" />
                    <Line type="monotone" dataKey="depth_50m" stroke="#1e3a8a" strokeWidth={2} name="50m Depth" />
                    <Line type="monotone" dataKey="depth_100m" stroke="#f97316" strokeWidth={2} name="100m Depth" />
                    <Line type="monotone" dataKey="depth_200m" stroke="#10b981" strokeWidth={2} name="200m Depth" />
                  </LineChart>
                ) : (
                  <AreaChart data={getCurrentData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any) => [`${value} ${parameterInfo.unit}`, "Concentration"]}
                    />
                    <Area type="monotone" dataKey="concentration" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>ARGO float distribution across ocean basins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={floatDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) =>
                      `${entry.name}: ${(entry.percent * 100).toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {floatDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} floats`, "Count"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Data Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Weekly Change</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">+2.1%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Change</span>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">-0.8%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Seasonal Trend</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">+5.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ARGO Floats</span>
              <Badge variant="secondary">3,847 active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Satellite Data</span>
              <Badge variant="secondary">12 missions</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Research Vessels</span>
              <Badge variant="secondary">89 active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Coastal Stations</span>
              <Badge variant="secondary">234 stations</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Global Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Atlantic Ocean</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pacific Ocean</span>
                <span>89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Indian Ocean</span>
                <span>76%</span>
              </div>
              <Progress value={76} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Arctic Ocean</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
