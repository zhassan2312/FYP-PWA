"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BlocklyWorkspace, ROBOT_TOOLBOX } from "~/components/blockly-workspace";
import { RobotStatusPanel } from "~/components/robot-status-panel";
import { robotService, type RobotStatus } from "~/lib/robot-service";
import { 
  Play, 
  Square, 
  Save, 
  Download, 
  Upload,
  RotateCcw,
  Grid3X3,
  Zap,
  Eye,
  Volume2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Gauge,
  Target,
  Thermometer
} from "lucide-react";

export default function BlocklyPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [robotStatus, setRobotStatus] = useState<RobotStatus>(robotService.getStatus());
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [programCommands, setProgramCommands] = useState<any[]>([]);

  // Subscribe to robot status updates
  useEffect(() => {
    const handleStatusUpdate = (status: RobotStatus) => {
      setRobotStatus(status);
      setIsRunning(status.running);
    };

    robotService.onStatusChange(handleStatusUpdate);
    
    return () => {
      robotService.removeStatusListener(handleStatusUpdate);
    };
  }, []);

  const handleRun = async () => {
    if (isRunning) {
      // Stop program
      robotService.stopProgram();
    } else {
      // Run program
      try {
        if (programCommands.length === 0) {
          alert('No program to run! Drag some blocks to the workspace first.');
          return;
        }
        
        await robotService.executeProgram(programCommands);
      } catch (error) {
        console.error('Failed to run program:', error);
        alert('Failed to run program: ' + (error as Error).message);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to IndexedDB or localStorage
      const programData = {
        code: generatedCode,
        commands: programCommands,
        timestamp: Date.now()
      };
      
      localStorage.setItem('blockly_program', JSON.stringify(programData));
      console.log('Program saved successfully');
    } catch (error) {
      console.error('Failed to save program:', error);
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  const handleCodeChange = useCallback((code: string) => {
    setGeneratedCode(code);
  }, []);

  const handleProgramChange = useCallback((commands: any[]) => {
    setProgramCommands(commands);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Block Programming</h1>
          </div>
          <Badge variant="outline">
            Visual Programming
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Load
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          
          <Button 
            onClick={handleRun}
            className={isRunning ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {isRunning ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Block Palette */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Block Palette</h3>
            
            {/* Motion Blocks */}
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Motor Control
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Set Motor Power
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <ArrowUp className="h-4 w-4" />
                    Move Forward
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <ArrowDown className="h-4 w-4" />
                    Move Backward
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Turn Left
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Turn Right
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Stop Motors
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Set Servo Position
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Stepper Steps
                  </div>
                </div>
              </div>

              {/* Sensor Blocks */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Sensors
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Read Ultrasonic Distance
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Read Color Sensor
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Read Touch Sensor
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Read Gyro Angle
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Read IR Sensor
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Read Force Sensor
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Read Distance (ToF)
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Read Temperature
                  </div>
                </div>
              </div>

              {/* Control Blocks */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Control Flow</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg text-sm cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800">
                    If/Else
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg text-sm cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800">
                    Repeat Forever
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg text-sm cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800">
                    Repeat N Times
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg text-sm cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-800">
                    Wait
                  </div>
                </div>
              </div>

              {/* Logic Blocks */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Logic</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-sm cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800">
                    And
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-sm cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800">
                    Or
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-sm cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800">
                    Not
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-sm cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-800">
                    Compare
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blockly Workspace */}
        <div className="flex-1 bg-muted/30">
          <BlocklyWorkspace 
            toolboxConfig={ROBOT_TOOLBOX}
            onCodeChange={handleCodeChange}
            onProgramChange={handleProgramChange}
          />
        </div>

        {/* Robot Status Panel */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Robot Status</h3>
            <RobotStatusPanel />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : robotStatus.connected ? 'bg-blue-500' : 'bg-gray-400'}`} />
            <span>{isRunning ? 'Program Running' : robotStatus.connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="text-muted-foreground">
            Controller: {robotStatus.connected ? 'Ready' : 'Not Connected'}
          </div>
          {robotStatus.connected && (
            <div className="text-muted-foreground">
              Motors: L{robotStatus.motors.left.power}% R{robotStatus.motors.right.power}%
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div>Commands: {programCommands.length}</div>
          <div>Status: {robotStatus.connected ? 'Online' : 'Offline'}</div>
        </div>
      </div>
    </div>
  );
}
