"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DeviceStatusChip } from "~/components/layout/device-status-chip";
import { Grid, Play, Cpu, Zap, Eye, Code, Settings } from "lucide-react";

// Mock controller data - this would come from actual controller connection
const mockController = {
  id: "main-controller",
  name: "My Robot Controller",
  type: "ev3" as const,
  status: "online" as const,
  batteryLevel: 85,
  connectionType: "usb" as const,
  signalStrength: 4,
  connectedComponents: 6,
  availablePorts: 2,
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Robot Control Center</h1>
          <p className="text-muted-foreground">
            Control your robot controller and start programming
          </p>
        </div>
      </div>

      {/* Controller Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controller Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockController.status === "online" ? "Online" : "Offline"}
            </div>
            <p className="text-xs text-muted-foreground">
              Battery: {mockController.batteryLevel}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockController.connectedComponents}</div>
            <p className="text-xs text-muted-foreground">
              Motors and sensors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Ports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockController.availablePorts}</div>
            <p className="text-xs text-muted-foreground">
              Ready for new components
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">USB</div>
            <p className="text-xs text-muted-foreground">
              Stable connection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Controller Quick Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Main Controller</CardTitle>
          <CardDescription>
            Quick access to your robot brick and essential controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceStatusChip
            {...mockController}
            onClick={() => {
              // Navigate to controller page
              console.log("Navigate to controller:", mockController.id);
            }}
          />
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-24 flex-col gap-2" variant="outline">
              <Cpu className="h-8 w-8" />
              <span>Controller Info</span>
              <span className="text-xs text-muted-foreground">View details</span>
            </Button>
            
            <Button className="h-24 flex-col gap-2" variant="outline">
              <Zap className="h-8 w-8" />
              <span>Test Motors</span>
              <span className="text-xs text-muted-foreground">Run motor tests</span>
            </Button>
            
            <Button className="h-24 flex-col gap-2" variant="outline">
              <Eye className="h-8 w-8" />
              <span>Read Sensors</span>
              <span className="text-xs text-muted-foreground">Check sensor values</span>
            </Button>
            
            <Button className="h-24 flex-col gap-2" variant="outline">
              <Settings className="h-8 w-8" />
              <span>Configure</span>
              <span className="text-xs text-muted-foreground">Setup robot</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Programming Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Programming Options</CardTitle>
          <CardDescription>
            Choose your programming method and start coding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button className="h-32 flex-col gap-3" variant="outline" size="lg">
              <Grid className="h-12 w-12" />
              <div className="text-center">
                <div className="font-semibold">Block Programming</div>
                <div className="text-xs text-muted-foreground">Visual drag-and-drop coding</div>
              </div>
            </Button>
            
            <Button className="h-32 flex-col gap-3" variant="outline" size="lg">
              <Code className="h-12 w-12" />
              <div className="text-center">
                <div className="font-semibold">Text Programming</div>
                <div className="text-xs text-muted-foreground">Python/JavaScript coding</div>
              </div>
            </Button>
            
            <Button className="h-32 flex-col gap-3" variant="outline" size="lg">
              <Play className="h-12 w-12" />
              <div className="text-center">
                <div className="font-semibold">Simulator</div>
                <div className="text-xs text-muted-foreground">Test without hardware</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Direct Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Direct Control</CardTitle>
          <CardDescription>
            Manually control your robot for testing and calibration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <div className="w-6 h-6 bg-current rounded-sm flex items-center justify-center text-background">
                ▲
              </div>
              <span>Forward</span>
            </Button>
            
            <Button className="h-20 flex-col gap-2" variant="outline">
              <div className="w-6 h-6 bg-current rounded-sm flex items-center justify-center text-background">
                ◄
              </div>
              <span>Left</span>
            </Button>
            
            <Button className="h-20 flex-col gap-2" variant="outline">
              <div className="w-6 h-6 bg-current rounded-sm flex items-center justify-center text-background">
                ►
              </div>
              <span>Right</span>
            </Button>
            
            <Button className="h-20 flex-col gap-2" variant="outline">
              <div className="w-6 h-6 bg-current rounded-sm flex items-center justify-center text-background">
                ■
              </div>
              <span>Stop</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
