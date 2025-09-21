"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
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
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
  Globe,
  Users,
  Brain,
  BarChart3,
  PieChartIcon,
  Target,
} from "lucide-react"

// Mock real-time analytics data
const realtimeMetrics = {
  activeUsers: 1247,
  queriesPerHour: 342,
  dataProcessed: "2.4TB",
  systemHealth: 98.5,
  responseTime: 245,
  errorRate: 0.02,
}

const userActivityData = [
  { hour: "00:00", users: 45, queries: 23, dataVolume: 120 },
  { hour: "04:00", users: 32, queries: 18, dataVolume: 95 },
  { hour: "08:00", users: 156, queries: 89, dataVolume: 340 },
  { hour: "12:00", users: 234, queries: 145, dataVolume: 520 },
  { hour: "16:00", users: 198, queries: 112, dataVolume: 445 },
  { hour: "20:00", users: 167, queries: 98, dataVolume: 380 },
]

const queryTypeDistribution = [
  { type: "Temperature", count: 1247, percentage: 35, color: "#0891b2" },
  { type: "Salinity", count: 892, percentage: 25, color: "#1e3a8a" },
  { type: "Chlorophyll", count: 623, percentage: 18, color: "#10b981" },
  { type: "Ocean Currents", count: 445, percentage: 12, color: "#f97316" },
  { type: "Other", count: 356, percentage: 10, color: "#eab308" },
]

const performanceMetrics = [
  { metric: "API Response Time", value: 245, unit: "ms", trend: -12, status: "good" },
  { metric: "Data Processing Speed", value: 2.4, unit: "TB/hr", trend: 8, status: "excellent" },
  { metric: "Query Success Rate", value: 99.8, unit: "%", trend: 0.2, status: "excellent" },
  { metric: "System Uptime", value: 99.95, unit: "%", trend: 0, status: "excellent" },
  { metric: "Cache Hit Rate", value: 87.3, unit: "%", trend: 5, status: "good" },
  { metric: "Error Rate", value: 0.02, unit: "%", trend: -0.01, status: "excellent" },
]

const dataSourceHealth = [
  { source: "ERDDAP Servers", status: "healthy", uptime: 99.8, lastCheck: "2 min ago", dataPoints: "2.4M" },
  { source: "ARGO Float Network", status: "healthy", uptime: 98.5, lastCheck: "5 min ago", dataPoints: "847K" },
  { source: "Satellite Data", status: "warning", uptime: 95.2, lastCheck: "12 min ago", dataPoints: "1.2M" },
  { source: "Research Vessels", status: "healthy", uptime: 97.8, lastCheck: "8 min ago", dataPoints: "156K" },
  { source: "Coastal Stations", status: "healthy", uptime: 99.1, lastCheck: "3 min ago", dataPoints: "234K" },
]

const aiInsights = [
  {
    id: 1,
    type: "anomaly",
    title: "Temperature Anomaly Detected",
    description: "Unusual warming pattern observed in the Arabian Sea region",
    confidence: 87,
    timestamp: "2 hours ago",
    severity: "medium",
  },
  {
    id: 2,
    type: "trend",
    title: "Seasonal Chlorophyll Increase",
    description: "Expected seasonal bloom pattern confirmed in satellite data",
    confidence: 94,
    timestamp: "4 hours ago",
    severity: "low",
  },
  {
    id: 3,
    type: "prediction",
    title: "Upwelling Event Forecast",
    description: "Model predicts coastal upwelling event in next 72 hours",
    confidence: 78,
    timestamp: "6 hours ago",
    severity: "high",
  },
]

export function AnalyticsDashboard() {
  const [selectedMetric, setSelectedMetric] = useState("users")
  const [realTimeData, setRealTimeData] = useState(realtimeMetrics)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        queriesPerHour: prev.queriesPerHour + Math.floor(Math.random() * 20 - 10),
        responseTime: prev.responseTime + Math.floor(Math.random() * 20 - 10),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-blue-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{realTimeData.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries/Hour</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{realTimeData.queriesPerHour}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Processed</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{realTimeData.dataProcessed}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{realTimeData.systemHealth}%</div>
            <Progress value={realTimeData.systemHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{realTimeData.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline w-3 h-3 mr-1" />
              -5% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{realTimeData.errorRate}%</div>
            <p className="text-xs text-muted-foreground">Well below threshold</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="activity">User Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  User Activity Trends
                </CardTitle>
                <CardDescription>Hourly user engagement and query patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="#0891b2"
                        fill="#0891b2"
                        fillOpacity={0.6}
                        name="Active Users"
                      />
                      <Area
                        type="monotone"
                        dataKey="queries"
                        stackId="2"
                        stroke="#1e3a8a"
                        fill="#1e3a8a"
                        fillOpacity={0.6}
                        name="Queries"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-primary" />
                  Query Type Distribution
                </CardTitle>
                <CardDescription>Most popular oceanographic parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={queryTypeDistribution}
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
                        {queryTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}
                        {metric.unit}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        {metric.trend > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : metric.trend < 0 ? (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        ) : null}
                        {metric.trend !== 0 && `${Math.abs(metric.trend)}${metric.unit}`}
                      </div>
                    </div>
                    <Badge variant={metric.status === "excellent" ? "default" : "secondary"}>{metric.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Data Source Health Monitor
              </CardTitle>
              <CardDescription>Real-time status of oceanographic data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSourceHealth.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(source.status)}
                      <div>
                        <div className="font-medium">{source.source}</div>
                        <div className="text-sm text-muted-foreground">Last check: {source.lastCheck}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{source.uptime}% uptime</div>
                      <div className="text-sm text-muted-foreground">{source.dataPoints} data points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>Automated analysis and predictions from oceanographic data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            insight.type === "anomaly"
                              ? "bg-orange-100 dark:bg-orange-900"
                              : insight.type === "trend"
                                ? "bg-blue-100 dark:bg-blue-900"
                                : "bg-purple-100 dark:bg-purple-900"
                          }`}
                        >
                          {insight.type === "anomaly" && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                          {insight.type === "trend" && <TrendingUp className="w-4 h-4 text-blue-600" />}
                          {insight.type === "prediction" && <Target className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{insight.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">{insight.description}</div>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.confidence}% confidence
                            </Badge>
                            <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          insight.severity === "high"
                            ? "destructive"
                            : insight.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {insight.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
