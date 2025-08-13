"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { 
  User, 
  Bell, 
  Palette, 
  Wifi, 
  Download, 
  Shield, 
  Code, 
  Save,
  Trash2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
  });

  const [preferences, setPreferences] = useState({
    theme: "system",
    notifications: true,
    autoSave: true,
    codeCompletion: true,
    blockAnimations: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="connectivity" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Connectivity
          </TabsTrigger>
          <TabsTrigger value="developer" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Developer
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account data and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Download all your projects and settings
                  </p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <select
                  value={preferences.theme}
                  onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Editor Preferences</CardTitle>
              <CardDescription>
                Configure code editor and block editor settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes as you work
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoSave}
                  onChange={(e) => setPreferences(prev => ({ ...prev, autoSave: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Code Completion</Label>
                  <p className="text-sm text-muted-foreground">
                    Show suggestions while typing code
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.codeCompletion}
                  onChange={(e) => setPreferences(prev => ({ ...prev, codeCompletion: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Block Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth animations in block editor
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.blockAnimations}
                  onChange={(e) => setPreferences(prev => ({ ...prev, blockAnimations: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about device status and project updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get project updates and device alerts via email
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Error Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Immediate notifications for connection and runtime errors
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connectivity */}
        <TabsContent value="connectivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Connection</CardTitle>
              <CardDescription>
                Configure how devices connect to the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Connection Method</Label>
                <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                  <option value="wifi">Wi-Fi</option>
                  <option value="bluetooth">Bluetooth</option>
                  <option value="usb">USB</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                <Input id="timeout" type="number" defaultValue="30" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-reconnect</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically reconnect to devices when they come online
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developer */}
        <TabsContent value="developer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Developer Mode</CardTitle>
              <CardDescription>
                Advanced settings for developers and power users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Developer Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Unlock advanced features and debugging tools
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Debug Console</Label>
                  <p className="text-sm text-muted-foreground">
                    Show detailed logs and error messages
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Raw Code Export</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow exporting unprocessed Python/C++ code
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Control your data privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the platform by sharing usage data
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Crash Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send error reports to help fix bugs
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Projects</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your projects to be visible to other users
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}