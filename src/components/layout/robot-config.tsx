"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  Cpu, 
  Zap, 
  Eye, 
  Volume2, 
  Thermometer,
  Gauge,
  Settings,
  Plus
} from "lucide-react";

interface Port {
  id: string;
  label: string;
  type: "motor" | "sensor" | "input" | "output";
  connected?: {
    name: string;
    deviceType: "large-motor" | "medium-motor" | "ultrasonic" | "color" | "touch" | "gyro" | "light" | "sound" | "temperature" | "custom";
  };
}

interface RobotConfigProps {
  controller: {
    type: "ev3" | "raspberry-pi" | "arduino" | "micro-bit";
    name: string;
    status: "online" | "offline";
  };
  ports: Port[];
  onConfigurePort: (portId: string) => void;
  onAddComponent: () => void;
}

export function RobotConfig({ controller, ports, onConfigurePort, onAddComponent }: RobotConfigProps) {
  const getPortIcon = (type: string) => {
    switch (type) {
      case "motor": return Zap;
      case "sensor": return Eye;
      case "input": return Volume2;
      case "output": return Gauge;
      default: return Settings;
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case "large-motor":
      case "medium-motor":
        return Zap;
      case "ultrasonic":
      case "color":
      case "light":
        return Eye;
      case "touch":
        return Volume2;
      case "gyro":
        return Gauge;
      case "sound":
        return Volume2;
      case "temperature":
        return Thermometer;
      default:
        return Settings;
    }
  };

  const getDeviceTypeColor = (deviceType?: string) => {
    switch (deviceType) {
      case "large-motor":
      case "medium-motor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "ultrasonic":
      case "color":
      case "light":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "touch":
      case "sound":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "gyro":
      case "temperature":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controller Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Main Controller
              </CardTitle>
              <CardDescription>
                {controller.name} - {controller.type.toUpperCase()}
              </CardDescription>
            </div>
            <Badge variant={controller.status === "online" ? "default" : "secondary"}>
              {controller.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Robot Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Robot Configuration</CardTitle>
              <CardDescription>
                Configure motors, sensors, and I/O ports
              </CardDescription>
            </div>
            <Button onClick={onAddComponent} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ports.map((port) => {
              const PortIcon = getPortIcon(port.type);
              const DeviceIcon = port.connected ? getDeviceIcon(port.connected.deviceType) : null;
              
              return (
                <div
                  key={port.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => onConfigurePort(port.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <PortIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{port.label}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {port.type}
                    </Badge>
                  </div>

                  {port.connected ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {DeviceIcon && <DeviceIcon className="h-4 w-4" />}
                        <span className="text-sm font-medium">{port.connected.name}</span>
                      </div>
                      <Badge 
                        className={`text-xs ${getDeviceTypeColor(port.connected.deviceType)}`}
                        variant="secondary"
                      >
                        {port.connected.deviceType.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No device connected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Motors</div>
                <div className="text-lg font-bold">
                  {ports.filter(p => p.connected?.deviceType.includes("motor")).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm font-medium">Sensors</div>
                <div className="text-lg font-bold">
                  {ports.filter(p => p.connected && !p.connected.deviceType.includes("motor")).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-sm font-medium">Available</div>
                <div className="text-lg font-bold">
                  {ports.filter(p => !p.connected).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm font-medium">Total Ports</div>
                <div className="text-lg font-bold">{ports.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
