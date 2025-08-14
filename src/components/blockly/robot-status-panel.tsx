"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { type RobotStatus } from "~/lib/robot-service";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Gauge, 
  Thermometer,
  Eye,
  RotateCcw,
  Zap,
  Sun,
  Droplets,
  Radar,
  MapPin,
  Clock,
  Monitor,
  Cpu
} from "lucide-react";

interface RobotStatusPanelProps {
  robotStatus: RobotStatus;
  isClient: boolean;
}

export function RobotStatusPanel({ robotStatus, isClient }: RobotStatusPanelProps) {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!isClient) {
    return (
      <div className="w-full sm:w-80 lg:w-96 xl:w-80 bg-card/30 backdrop-blur-sm border-l border-border/50 p-2 sm:p-4 h-full">
        <div className="space-y-3 sm:space-y-4 h-full overflow-y-auto">
          <div className="h-16 sm:h-20 bg-muted/50 rounded animate-pulse" />
          <div className="h-24 sm:h-32 bg-muted/50 rounded animate-pulse" />
          <div className="h-20 sm:h-24 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-80 lg:w-96 xl:w-80 bg-card/30 backdrop-blur-sm border-l border-border/50 flex-shrink-0 h-full">
      <div className="p-2 sm:p-4 space-y-3 sm:space-y-4 h-full overflow-y-auto">
        {/* Connection Status */}
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
              {robotStatus.connected ? 
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : 
                <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              }
              <span className="truncate">Connection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant={robotStatus.connected ? "default" : "destructive"} className="text-xs flex-shrink-0">
                {robotStatus.connected ? "Connected" : "Disconnected"}
              </Badge>
              <span className="text-xs text-muted-foreground truncate ml-2">
                {formatTimestamp(robotStatus.lastUpdate)}
              </span>
            </div>
            
            {robotStatus.connected && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Activity className={`h-3 w-3 flex-shrink-0 ${robotStatus.running ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                  <span className="truncate">Status: {robotStatus.running ? 'Running' : 'Idle'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-3 w-3 flex-shrink-0 text-blue-500" />
                  <span className="truncate">Pos: ({robotStatus.position.x.toFixed(1)}, {robotStatus.position.y.toFixed(1)})</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <RotateCcw className="h-3 w-3 flex-shrink-0 text-purple-500" />
                  <span className="truncate">Angle: {robotStatus.position.angle.toFixed(1)}°</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motor Status */}
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
              <span className="truncate">Motor Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Left Motor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium truncate">Left Motor</span>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {robotStatus.motors.left.direction}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Power</span>
                  <span className="flex-shrink-0">{robotStatus.motors.left.power}%</span>
                </div>
                <Progress 
                  value={Math.abs(robotStatus.motors.left.power)} 
                  className="h-1.5 sm:h-2"
                />
              </div>
            </div>

            {/* Right Motor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium truncate">Right Motor</span>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {robotStatus.motors.right.direction}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Power</span>
                  <span className="flex-shrink-0">{robotStatus.motors.right.power}%</span>
                </div>
                <Progress 
                  value={Math.abs(robotStatus.motors.right.power)} 
                  className="h-1.5 sm:h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Readings */}
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
              <span className="truncate">Sensor Readings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {Object.keys(robotStatus.sensors).length > 0 ? (
              <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                {Object.entries(robotStatus.sensors).map(([sensor, value]) => (
                  <div key={sensor} className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {sensor.includes('distance') && <Radar className="h-3 w-3 text-green-500 flex-shrink-0" />}
                      {sensor.includes('temperature') && <Thermometer className="h-3 w-3 text-red-500 flex-shrink-0" />}
                      {sensor.includes('light') && <Sun className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                      {sensor.includes('humidity') && <Droplets className="h-3 w-3 text-blue-500 flex-shrink-0" />}
                      <span className="font-medium capitalize truncate">{sensor}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {typeof value === 'number' ? value.toFixed(2) : String(value)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground text-center py-3 sm:py-4">
                No sensor data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="bg-card/80 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Monitor className="h-4 w-4 text-gray-500" />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  <span>{robotStatus.running ? 'Active' : 'Idle'}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-muted-foreground">Uptime</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{Math.floor((Date.now() - robotStatus.lastUpdate) / 1000)}s</span>
                </div>
              </div>
            </div>
            
            {robotStatus.error && (
              <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                <span className="text-destructive font-medium">Error: </span>
                <span className="text-destructive/80">{robotStatus.error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
