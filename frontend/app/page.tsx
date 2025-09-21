"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { DataDashboard } from "@/components/data-dashboard"
import { AdvancedCharts } from "@/components/advanced-charts"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { OceanMap } from "@/components/ocean-map"
import { UserProfile } from "@/components/user-profile"
import { AdvancedSearch } from "@/components/advanced-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Waves, MessageSquare, BarChart3, Map, User, Search, Activity, TrendingUp, Brain, Download } from "lucide-react"

export default function OceanDashboard() {
  const [activeSession, setActiveSession] = useState<string | null>(null)

  const handleExportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      activeFloats: 3847,
      dataPoints: 2400000,
      coverage: 89,
      queries: 1234,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ocean-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="fixed inset-0 opacity-5 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/beautiful-ocean-waves-underwater-scene.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Waves className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FloatChat</h1>
                <p className="text-sm text-muted-foreground">Intelligent Oceanographic Data Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Activity className="w-3 h-3" />
                Live Data
              </Badge>
              <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 relative z-10">
        <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="flex w-full overflow-x-auto gap-1 lg:w-fit">
        <TabsTrigger value="dashboard" className="gap-2 flex-shrink-0">
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="charts" className="gap-2 flex-shrink-0">
          <TrendingUp className="w-4 h-4" />
          Advanced Charts
        </TabsTrigger>
        <TabsTrigger value="analytics" className="gap-2 flex-shrink-0">
          <Brain className="w-4 h-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="chat" className="gap-2 flex-shrink-0">
          <MessageSquare className="w-4 h-4" />
          AI Chat
        </TabsTrigger>
        <TabsTrigger value="map" className="gap-2 flex-shrink-0">
          <Map className="w-4 h-4" />
          Ocean Map
        </TabsTrigger>
        <TabsTrigger value="search" className="gap-2 flex-shrink-0">
          <Search className="w-4 h-4" />
          Advanced Search
        </TabsTrigger>
        <TabsTrigger value="profile" className="gap-2 flex-shrink-0">
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
      </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "url('/argo-ocean-float-in-blue-water.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium">Active Floats</CardTitle>
                  <Waves className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold text-primary">3,847</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "url('/ocean-data-visualization-underwater.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium">Data Points</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold text-primary">2.4M</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "url('/global-ocean-coverage-satellite-view.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium">Coverage</CardTitle>
                  <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold text-primary">89%</div>
                  <p className="text-xs text-muted-foreground">Global ocean coverage</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "url('/ai-brain-processing-ocean-data.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium">Queries</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold text-primary">1,234</div>
                  <p className="text-xs text-muted-foreground">AI queries processed</p>
                </CardContent>
              </Card>
            </div>
            <DataDashboard />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <AdvancedCharts />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  AI Chat Interface
                </CardTitle>
                <CardDescription>
                  Ask questions about oceanographic data and get intelligent responses powered by ERDDAP integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatInterface activeSession={activeSession} onSessionChange={setActiveSession} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary" />
                  Interactive Ocean Map
                </CardTitle>
                <CardDescription>Explore ARGO float locations and oceanographic data in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <OceanMap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Advanced Search & Filtering
                </CardTitle>
                <CardDescription>Search and filter oceanographic data with advanced criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <AdvancedSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
