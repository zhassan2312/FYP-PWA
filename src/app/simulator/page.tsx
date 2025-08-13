"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Zap, 
  Camera, 
  Gauge,
  MapPin,
  Cpu
} from "lucide-react";

export default function SimulatorPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 50 });
  const [robotAngle, setRobotAngle] = useState(0);
  const [sensorData, setSensorData] = useState({
    distance: 25.4,
    battery: 85,
    speed: 0,
  });

  const handleRun = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      // Start simulation
      setSensorData(prev => ({ ...prev, speed: 15 }));
    } else {
      // Stop simulation
      setSensorData(prev => ({ ...prev, speed: 0 }));
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setRobotPosition({ x: 50, y: 50 });
    setRobotAngle(0);
    setSensorData({
      distance: 25.4,
      battery: 85,
      speed: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Robot Simulator</h1>
          <p className="text-muted-foreground">
            Test your robot programs in a virtual environment
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleRun} className={isRunning ? "bg-red-600 hover:bg-red-700" : ""}>
            {isRunning ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Environment</CardTitle>
              <CardDescription>
                2D simulation of robot movement and sensors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                {/* Grid background */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-muted-foreground/20"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Robot */}
                <div
                  className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-blue-600 transition-all duration-200"
                  style={{
                    left: `${robotPosition.x}%`,
                    top: `${robotPosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${robotAngle}deg)`,
                  }}
                >
                  {/* Robot direction indicator */}
                  <div className="absolute top-0 left-1/2 w-1 h-3 bg-blue-600 rounded-sm -translate-x-1/2 -translate-y-1" />
                  
                  {/* Sensor range indicator */}
                  {isRunning && (
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-400 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Obstacles */}
                <div className="absolute top-[20%] left-[30%] w-16 h-16 bg-red-400 rounded-lg opacity-60" />
                <div className="absolute bottom-[30%] right-[25%] w-12 h-24 bg-red-400 rounded-lg opacity-60" />
                
                {/* Status overlay */}
                <div className="absolute top-4 left-4">
                  <Badge variant={isRunning ? "default" : "secondary"}>
                    {isRunning ? "Running" : "Stopped"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Robot Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Controller Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Position:</span>
                  <span>({robotPosition.x.toFixed(1)}, {robotPosition.y.toFixed(1)})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Angle:</span>
                  <span>{robotAngle}°</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Speed:</span>
                  <span>{sensorData.speed} cm/s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Connection:</span>
                  <span className="text-green-600">USB Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motor & Sensor Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Motors & Sensors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium">Motors</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Motor A (Left):</span>
                    <span>{isRunning ? "50%" : "0%"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Motor B (Right):</span>
                    <span>{isRunning ? "50%" : "0%"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Motor C (Arm):</span>
                    <span>0%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Sensors</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Ultrasonic:</span>
                    <span>{sensorData.distance} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span>Blue</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Touch:</span>
                    <span>Released</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" disabled={!isRunning}>
                <Zap className="h-4 w-4 mr-2" />
                Emergency Stop
              </Button>
              
              <Button variant="outline" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Camera View
              </Button>
              
              <Button variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Set Waypoint
              </Button>
            </CardContent>
          </Card>

          {/* Environment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  Maze
                </Button>
                <Button variant="outline" size="sm">
                  Open Field
                </Button>
                <Button variant="outline" size="sm">
                  Obstacles
                </Button>
                <Button variant="outline" size="sm">
                  Custom
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}