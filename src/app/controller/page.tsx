"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { DeviceStatusChip } from "~/components/layout/device-status-chip";
import { RobotConfig } from "~/components/layout/robot-config";
import { Badge } from "~/components/ui/badge";
import { 
  Usb, 
  Bluetooth, 
  Wifi, 
  RefreshCw, 
  Power,
  Settings,
  Zap,
  Eye,
  Volume2
} from "lucide-react";

// Mock controller data
const mockController = {
  type: "ev3" as const,
  name: "My EV3 Controller",
  status: "online" as const,
};

// Mock ports configuration
const mockPorts = [
  {
    id: "motor-a",
    label: "Motor Port A",
    type: "motor" as const,
    connected: {
      name: "Left Wheel Motor",
      deviceType: "large-motor" as const,
    },
  },
  {
    id: "motor-b", 
    label: "Motor Port B",
    type: "motor" as const,
    connected: {
      name: "Right Wheel Motor",
      deviceType: "large-motor" as const,
    },
  },
  {
    id: "motor-c",
    label: "Motor Port C",
    type: "motor" as const,
    connected: {
      name: "Arm Motor",
      deviceType: "medium-motor" as const,
    },
  },
  {
    id: "motor-d",
    label: "Motor Port D", 
    type: "motor" as const,
  },
  {
    id: "sensor-1",
    label: "Sensor Port 1",
    type: "sensor" as const,
    connected: {
      name: "Ultrasonic Sensor",
      deviceType: "ultrasonic" as const,
    },
  },
  {
    id: "sensor-2",
    label: "Sensor Port 2",
    type: "sensor" as const,
    connected: {
      name: "Color Sensor",
      deviceType: "color" as const,
    },
  },
  {
    id: "sensor-3",
    label: "Sensor Port 3",
    type: "sensor" as const,
    connected: {
      name: "Touch Sensor",
      deviceType: "touch" as const,
    },
  },
  {
    id: "sensor-4",
    label: "Sensor Port 4",
    type: "sensor" as const,
  },
];

export default function ControllerPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<"usb" | "bluetooth" | "wifi">("usb");

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
  };

  const handleConfigurePort = (portId: string) => {
    console.log("Configure port:", portId);
    // This would open a port configuration modal
  };

  const handleAddComponent = () => {
    console.log("Add component");
    // This would open component selection modal
  };

  const getConnectionIcon = (method: string) => {
    switch (method) {
      case "usb": return Usb;
      case "bluetooth": return Bluetooth;
      case "wifi": return Wifi;
      default: return Usb;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Robot Controller</h1>
          <p className="text-muted-foreground">
            Connect and configure your main robot controller
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleConnect} disabled={isConnecting}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isConnecting ? "animate-spin" : ""}`} />
            {isConnecting ? "Connecting..." : "Reconnect"}
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Connection Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
          <CardDescription>
            Choose how to connect to your robot controller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["usb", "bluetooth", "wifi"] as const).map((method) => {
              const Icon = getConnectionIcon(method);
              const isSelected = connectionMethod === method;
              
              return (
                <button
                  key={method}
                  onClick={() => setConnectionMethod(method)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium capitalize">{method}</span>
                    {isSelected && <Badge variant="default">Selected</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method === "usb" && "Direct cable connection for reliable communication"}
                    {method === "bluetooth" && "Wireless connection for mobile robots"}
                    {method === "wifi" && "Network connection for advanced features"}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Controller Status */}
      <Card>
        <CardHeader>
          <CardTitle>Controller Status</CardTitle>
          <CardDescription>
            Current status of your main robot controller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceStatusChip
            id="main-controller"
            name="EV3 Brick"
            type="ev3"
            status="online"
            batteryLevel={85}
            connectionType={connectionMethod}
            signalStrength={connectionMethod === "wifi" ? 4 : undefined}
            className="mb-4"
          />
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Power className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Status</div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Zap className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Motors</div>
              <div className="text-xs text-muted-foreground">
                {mockPorts.filter(p => p.type === "motor" && p.connected).length} / {mockPorts.filter(p => p.type === "motor").length}
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Eye className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Sensors</div>
              <div className="text-xs text-muted-foreground">
                {mockPorts.filter(p => p.type === "sensor" && p.connected).length} / {mockPorts.filter(p => p.type === "sensor").length}
              </div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Volume2 className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium">Battery</div>
              <div className="text-xs text-muted-foreground">85%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Robot Configuration */}
      <RobotConfig
        controller={mockController}
        ports={mockPorts}
        onConfigurePort={handleConfigurePort}
        onAddComponent={handleAddComponent}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common controller operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Power className="h-6 w-6 mb-2" />
              Controller Info
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Zap className="h-6 w-6 mb-2" />
              Test Motors
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Eye className="h-6 w-6 mb-2" />
              Read Sensors
            </Button>
            
            <Button variant="outline" className="h-20 flex-col">
              <Volume2 className="h-6 w-6 mb-2" />
              Play Sound
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Guide</CardTitle>
          <CardDescription>
            First time connecting your robot controller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Power On Controller</h4>
                <p className="text-sm text-muted-foreground">
                  Turn on your EV3/Arduino/Pi and ensure it's ready to connect
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Choose Connection</h4>
                <p className="text-sm text-muted-foreground">
                  Select USB, Bluetooth, or WiFi based on your setup
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Configure Robot</h4>
                <p className="text-sm text-muted-foreground">
                  Set up your motors and sensors for programming
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
