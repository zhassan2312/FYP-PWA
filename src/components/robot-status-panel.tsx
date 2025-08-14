"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { robotService, type RobotStatus } from "~/lib/robot-service";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Gauge, 
  Thermometer,
  Eye,
  RotateCcw,
  Zap
} from "lucide-react";

export function RobotStatusPanel() {
  const [status, setStatus] = useState<RobotStatus>(robotService.getStatus());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleStatusUpdate = (newStatus: RobotStatus) => {
      setStatus(newStatus);
    };

    robotService.onStatusChange(handleStatusUpdate);
    
    return () => {
      robotService.removeStatusListener(handleStatusUpdate);
    };
  }, []);

  const formatTimestamp = (timestamp: number) => {
    if (!isClient) return "Loading...";
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {status.connected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant={status.connected ? "default" : "destructive"}>
              {status.connected ? "Connected" : "Disconnected"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(status.lastUpdate)}
            </span>
          </div>
          {status.running && (
            <div className="flex items-center gap-2 mt-2">
              <Activity className="h-4 w-4 text-green-500 animate-pulse" />
              <span className="text-sm text-green-600">Program Running</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motor Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Motors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Left Motor:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{status.motors.left.power}%</Badge>
                <span className="text-xs text-muted-foreground">
                  {status.motors.left.direction}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Right Motor:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{status.motors.right.power}%</Badge>
                <span className="text-xs text-muted-foreground">
                  {status.motors.right.direction}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Readings */}
      {status.connected && status.sensors && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Sensors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {status.sensors.ultrasonic && (
                <div className="flex justify-between">
                  <span>Ultrasonic:</span>
                  <span>{status.sensors.ultrasonic.toFixed(1)} cm</span>
                </div>
              )}
              
              {status.sensors.temperature && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" />
                    Temperature:
                  </span>
                  <span>{status.sensors.temperature.toFixed(1)}°C</span>
                </div>
              )}
              
              {status.sensors.gyro && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    Gyro:
                  </span>
                  <span>
                    X:{status.sensors.gyro.x.toFixed(0)}° 
                    Y:{status.sensors.gyro.y.toFixed(0)}°
                  </span>
                </div>
              )}
              
              {status.sensors.color && (
                <div className="flex justify-between items-center">
                  <span>Color RGB:</span>
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ 
                        backgroundColor: `rgb(${status.sensors.color.r}, ${status.sensors.color.g}, ${status.sensors.color.b})`
                      }}
                    />
                    <span className="text-xs">
                      {status.sensors.color.r},{status.sensors.color.g},{status.sensors.color.b}
                    </span>
                  </div>
                </div>
              )}
              
              {status.sensors.touch && (
                <div className="flex justify-between">
                  <span>Touch Sensors:</span>
                  <div className="flex gap-1">
                    {status.sensors.touch.map((pressed, index) => (
                      <Badge 
                        key={index} 
                        variant={pressed ? "default" : "outline"}
                        className="w-6 h-6 p-0 text-xs"
                      >
                        {index + 1}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Servo Status */}
      {Object.keys(status.servos).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Servos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(status.servos).map(([servo, angle]) => (
                <div key={servo} className="flex justify-between items-center">
                  <span className="text-sm">{servo}:</span>
                  <Badge variant="outline">{angle}°</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
