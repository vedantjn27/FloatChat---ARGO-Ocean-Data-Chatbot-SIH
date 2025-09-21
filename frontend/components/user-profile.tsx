"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Settings,
  Bell,
  Shield,
  Download,
  History,
  Bookmark,
  Award,
  MapPin,
  Calendar,
  Activity,
  Database,
  MessageSquare,
  BarChart3,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react"

// Mock user data
const userData = {
  name: "Team Mavericks",
  email: "maverickes100@gmail.com",
  institution: "Marine Research Institute",
  role: "Senior Oceanographers",
  joinDate: "2023-01-15",
  avatar: "/oceanographer.jpg",
  bio: "Specializing in physical oceanography and climate change impacts on marine ecosystems. 15+ years of experience in oceanographic research.",
  location: "Banglore, India",
  timezone: "EST (UTC-5)",
}

const userStats = {
  totalQueries: 1247,
  dataDownloaded: "45.2 GB",
  sessionsCompleted: 89,
  favoriteRegions: 12,
  researchProjects: 5,
  collaborations: 23,
}

const recentActivity = [
  { id: 1, type: "query", description: "Searched for temperature data in Arabian Sea", timestamp: "2 hours ago" },
  { id: 2, type: "download", description: "Downloaded salinity dataset (2.3 GB)", timestamp: "5 hours ago" },
  { id: 3, type: "bookmark", description: "Bookmarked ARGO float #5904471", timestamp: "1 day ago" },
  { id: 4, type: "session", description: "Completed analysis session: Monsoon Impact Study", timestamp: "2 days ago" },
  { id: 5, type: "collaboration", description: "Shared dataset with Dr. Martinez", timestamp: "3 days ago" },
]

const bookmarkedLocations = [
  { id: 1, name: "Arabian Sea Upwelling Zone", lat: 15.5, lon: 68.2, type: "region" },
  { id: 2, name: "ARGO Float #5904471", lat: 18.7, lon: 72.1, type: "float" },
  { id: 3, name: "Mumbai Coastal Station", lat: 19.0, lon: 72.8, type: "station" },
  { id: 4, name: "Monsoon Research Area", lat: 16.0, lon: 70.0, type: "region" },
]

const researchProjects = [
  {
    id: 1,
    title: "Monsoon Impact on Arabian Sea Dynamics",
    status: "active",
    progress: 75,
    startDate: "2024-01-01",
    collaborators: 5,
    datasets: 12,
  },
  {
    id: 2,
    title: "Climate Change Effects on Upwelling",
    status: "active",
    progress: 45,
    startDate: "2024-02-15",
    collaborators: 3,
    datasets: 8,
  },
  {
    id: 3,
    title: "ARGO Float Data Quality Assessment",
    status: "completed",
    progress: 100,
    startDate: "2023-09-01",
    collaborators: 7,
    datasets: 25,
  },
]

const achievements = [
  { id: 1, title: "Data Explorers", description: "Downloaded over 50GB of data", icon: "🏆", earned: true },
  { id: 2, title: "Query Masters", description: "Completed 1000+ queries", icon: "🎯", earned: true },
  { id: 3, title: "Collaborators", description: "Shared data with 20+ researchers", icon: "🤝", earned: true },
  { id: 4, title: "Regional Experts", description: "Specialized in Arabian Sea research", icon: "🌊", earned: true },
  { id: 5, title: "Innovation Leaders", description: "Used advanced AI features 100+ times", icon: "🚀", earned: false },
]

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(userData)
  const [notifications, setNotifications] = useState({
    dataUpdates: true,
    systemAlerts: true,
    collaborationRequests: true,
    weeklyReports: false,
  })

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "query":
        return <MessageSquare className="w-4 h-4" />
      case "download":
        return <Download className="w-4 h-4" />
      case "bookmark":
        return <Bookmark className="w-4 h-4" />
      case "session":
        return <BarChart3 className="w-4 h-4" />
      case "collaboration":
        return <User className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Profile Information
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                      {isEditing ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback>
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editedData.name}
                            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                            placeholder="Full Name"
                          />
                          <Input
                            value={editedData.email}
                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                            placeholder="Email"
                            type="email"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-xl font-semibold">{userData.name}</h3>
                          <p className="text-muted-foreground">{userData.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{userData.role}</Badge>
                            <Badge variant="outline">{userData.institution}</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      {isEditing ? (
                        <Input
                          value={editedData.institution}
                          onChange={(e) => setEditedData({ ...editedData, institution: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm">{userData.institution}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      {isEditing ? (
                        <Select
                          value={editedData.role}
                          onValueChange={(value) => setEditedData({ ...editedData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Senior Oceanographer">Senior Oceanographer</SelectItem>
                            <SelectItem value="Research Scientist">Research Scientist</SelectItem>
                            <SelectItem value="Graduate Student">Graduate Student</SelectItem>
                            <SelectItem value="Professor">Professor</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm">{userData.role}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      {isEditing ? (
                        <Input
                          value={editedData.location}
                          onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {userData.location}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(userData.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedData.bio}
                        onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{userData.bio}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Your research milestones and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          achievement.earned ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-muted opacity-60"
                        }`}
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                        {achievement.earned && (
                          <Badge variant="secondary" className="text-xs">
                            Earned
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Queries</span>
                      <span className="font-medium">{userStats.totalQueries.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Downloaded</span>
                      <span className="font-medium">{userStats.dataDownloaded}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sessions</span>
                      <span className="font-medium">{userStats.sessionsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bookmarks</span>
                      <span className="font-medium">{userStats.favoriteRegions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Projects</span>
                      <span className="font-medium">{userStats.researchProjects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Collaborations</span>
                      <span className="font-medium">{userStats.collaborations}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <History className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Database className="w-4 h-4 mr-2" />
                    Manage Datasets
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest interactions with the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-muted rounded-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Research Projects
                  </CardTitle>
                  <CardDescription>Manage your ongoing research projects</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {researchProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Started {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <span>{project.collaborators} collaborators</span>
                      <span>{project.datasets} datasets</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-primary" />
                Bookmarked Locations
              </CardTitle>
              <CardDescription>Your saved locations and points of interest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookmarkedLocations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">{location.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {location.lat.toFixed(2)}°N, {location.lon.toFixed(2)}°E
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {location.type}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-updates">Data Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new data is available</p>
                </div>
                <Switch
                  id="data-updates"
                  checked={notifications.dataUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, dataUpdates: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-alerts">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important system maintenance and updates</p>
                </div>
                <Switch
                  id="system-alerts"
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="collaboration-requests">Collaboration Requests</Label>
                  <p className="text-sm text-muted-foreground">When someone wants to share data with you</p>
                </div>
                <Switch
                  id="collaboration-requests"
                  checked={notifications.collaborationRequests}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, collaborationRequests: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Summary of your weekly activity</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Download My Data
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
