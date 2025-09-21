"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Leaf,
  Wind,
  Database,
  Download,
  Bookmark,
  X,
  RotateCcw,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

// Mock search results
const searchResults = [
  {
    id: "1",
    title: "MODIS Aqua Sea Surface Temperature",
    description: "Daily 4km resolution SST data from MODIS Aqua satellite",
    datasetId: "erdMH1sstd1day",
    parameters: ["temperature"],
    region: "Global",
    timeRange: "2002-present",
    resolution: "4km",
    updateFrequency: "Daily",
    dataPoints: "2.4M",
    quality: 95,
    source: "NASA",
  },
  {
    id: "2",
    title: "ARGO Float Temperature Profiles",
    description: "In-situ temperature measurements from ARGO float network",
    datasetId: "argo_temp_profiles",
    parameters: ["temperature", "salinity", "pressure"],
    region: "Arabian Sea",
    timeRange: "2000-present",
    resolution: "Point data",
    updateFrequency: "Real-time",
    dataPoints: "847K",
    quality: 98,
    source: "ARGO",
  },
  {
    id: "3",
    title: "SMOS Sea Surface Salinity",
    description: "Satellite-derived sea surface salinity measurements",
    datasetId: "erdSMOS_SSS",
    parameters: ["salinity"],
    region: "Global",
    timeRange: "2010-present",
    resolution: "25km",
    updateFrequency: "3-day",
    dataPoints: "1.2M",
    quality: 87,
    source: "ESA",
  },
  {
    id: "4",
    title: "VIIRS Chlorophyll-a Concentration",
    description: "Ocean color data showing phytoplankton chlorophyll concentration",
    datasetId: "erdVIIRS_chl",
    parameters: ["chlorophyll"],
    region: "Global",
    timeRange: "2012-present",
    resolution: "750m",
    updateFrequency: "Daily",
    dataPoints: "3.1M",
    quality: 91,
    source: "NOAA",
  },
]

const savedSearches = [
  { id: 1, name: "Arabian Sea Temperature", query: "temperature Arabian Sea last 30 days", date: "2024-01-15" },
  { id: 2, name: "Monsoon Salinity Study", query: "salinity Indian Ocean June-September", date: "2024-01-10" },
  { id: 3, name: "Upwelling Chlorophyll", query: "chlorophyll coastal upwelling regions", date: "2024-01-05" },
]

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedParameters, setSelectedParameters] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [depthRange, setDepthRange] = useState([0, 1000])
  const [qualityThreshold, setQualityThreshold] = useState([80])
  const [dataSource, setDataSource] = useState("")
  const [resolution, setResolution] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState(searchResults)

  const parameters = [
    { id: "temperature", label: "Temperature", icon: Thermometer },
    { id: "salinity", label: "Salinity", icon: Droplets },
    { id: "chlorophyll", label: "Chlorophyll-a", icon: Leaf },
    { id: "oxygen", label: "Dissolved Oxygen", icon: Wind },
    { id: "currents", label: "Ocean Currents", icon: Wind },
    { id: "pressure", label: "Pressure", icon: Database },
  ]

  const regions = [
    "Global",
    "North Atlantic",
    "South Atlantic",
    "North Pacific",
    "South Pacific",
    "Indian Ocean",
    "Arabian Sea",
    "Bay of Bengal",
    "Mediterranean Sea",
    "Arctic Ocean",
  ]

  const dataSources = [
    "All Sources",
    "ARGO Floats",
    "Satellite Data",
    "Research Vessels",
    "Coastal Stations",
    "Moorings",
  ]

  const handleParameterChange = (parameterId: string, checked: boolean) => {
    if (checked) {
      setSelectedParameters([...selectedParameters, parameterId])
    } else {
      setSelectedParameters(selectedParameters.filter((p) => p !== parameterId))
    }
  }

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSearching(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedParameters([])
    setSelectedRegion("")
    setDateRange(undefined)
    setDepthRange([0, 1000])
    setQualityThreshold([80])
    setDataSource("")
    setResolution("")
  }

  const getParameterIcon = (parameter: string) => {
    const param = parameters.find((p) => p.id === parameter)
    return param ? param.icon : Database
  }

  const getQualityColor = (quality: number) => {
    if (quality >= 95) return "text-green-500"
    if (quality >= 85) return "text-blue-500"
    if (quality >= 75) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Search Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="w-4 h-4" />
                Search Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Search */}
              <div className="space-y-2">
                <Label>Search Query</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter search terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Parameters */}
              <div className="space-y-3">
                <Label>Parameters</Label>
                <div className="space-y-2">
                  {parameters.map((param) => {
                    const IconComponent = param.icon
                    return (
                      <div key={param.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={param.id}
                          checked={selectedParameters.includes(param.id)}
                          onCheckedChange={(checked) => handleParameterChange(param.id, checked as boolean)}
                        />
                        <Label htmlFor={param.id} className="flex items-center gap-2 text-sm">
                          <IconComponent className="w-3 h-3" />
                          {param.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Geographic Region */}
              <div className="space-y-2">
                <Label>Geographic Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </div>

              {/* Depth Range */}
              <div className="space-y-3">
                <Label>
                  Depth Range: {depthRange[0]}m - {depthRange[1]}m
                </Label>
                <Slider value={depthRange} onValueChange={setDepthRange} max={5000} step={10} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Surface</span>
                  <span>5000m</span>
                </div>
              </div>

              <Separator />

              {/* Data Quality */}
              <div className="space-y-3">
                <Label>Minimum Quality: {qualityThreshold[0]}%</Label>
                <Slider
                  value={qualityThreshold}
                  onValueChange={setQualityThreshold}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Data Source */}
              <div className="space-y-2">
                <Label>Data Source</Label>
                <Select value={dataSource} onValueChange={setDataSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resolution */}
              <div className="space-y-2">
                <Label>Spatial Resolution</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (&lt; 1km)</SelectItem>
                    <SelectItem value="medium">Medium (1-10km)</SelectItem>
                    <SelectItem value="low">Low (&gt; 10km)</SelectItem>
                    <SelectItem value="point">Point data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button onClick={handleSearch} className="w-full" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Search className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Saved Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Saved Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <div key={search.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{search.name}</div>
                      <div className="text-xs text-muted-foreground">{search.date}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Search Results
                  </CardTitle>
                  <CardDescription>Found {results.length} datasets matching your criteria</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{result.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getQualityColor(result.quality)}>
                          {result.quality}% quality
                        </Badge>
                        <Badge variant="secondary">{result.source}</Badge>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Parameters:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.parameters.map((param) => {
                            const IconComponent = getParameterIcon(param)
                            return (
                              <Badge key={param} variant="outline" className="text-xs">
                                <IconComponent className="w-3 h-3 mr-1" />
                                {param}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Region:</span>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{result.region}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time Range:</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{result.timeRange}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Resolution:</span>
                        <div className="mt-1">
                          <span>{result.resolution}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{result.dataPoints} data points</span>
                        <span>Updated {result.updateFrequency}</span>
                        <span>ID: {result.datasetId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          View on Map
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Temperature Data
                </Button>
                <Button variant="outline" size="sm">
                  <Droplets className="w-4 h-4 mr-2" />
                  Salinity Data
                </Button>
                <Button variant="outline" size="sm">
                  <Leaf className="w-4 h-4 mr-2" />
                  Chlorophyll Data
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Arabian Sea
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 30 Days
                </Button>
                <Button variant="outline" size="sm">
                  <Database className="w-4 h-4 mr-2" />
                  High Quality (&gt;95%)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
