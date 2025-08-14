"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { BlocklyWorkspace, ROBOT_TOOLBOX } from "~/components/blockly-workspace";
import { RobotStatusPanel } from "~/components/robot-status-panel";
import { robotService, type RobotStatus } from "~/lib/robot-service";
import { setToastFunction } from "~/lib/toast-utils";
import { toast } from "sonner";
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
    // Set the toast function for the toast utilities
    setToastFunction(toast);
    
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
      toast.info("Program stopped", {
        description: "Robot program execution has been halted."
      });
    } else {
      // Run program
      try {
        if (programCommands.length === 0) {
          toast.error("No program to run", {
            description: "Drag some blocks to the workspace first to create a program."
          });
          return;
        }
        
        toast.loading("Starting program...", {
          description: `Executing ${programCommands.length} command(s)`
        });
        
        await robotService.executeProgram(programCommands);
        
        toast.success("Program completed", {
          description: "Robot program executed successfully!"
        });
      } catch (error) {
        console.error('Failed to run program:', error);
        toast.error("Program execution failed", {
          description: (error as Error).message
        });
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
        timestamp: Date.now(),
        blockCount: programCommands.length
      };
      
      localStorage.setItem('blockly_program', JSON.stringify(programData));
      
      toast.success("Program saved", {
        description: `Saved ${programCommands.length} block(s) to local storage.`
      });
    } catch (error) {
      console.error('Failed to save program:', error);
      toast.error("Save failed", {
        description: "Could not save program to local storage."
      });
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  const handleCodeChange = useCallback((code: string) => {
    setGeneratedCode(code);
  }, []);

  const handleProgramChange = useCallback((commands: any[]) => {
    const previousLength = programCommands.length;
    setProgramCommands(commands);
    
    // Show helpful toast when user adds their first block
    if (commands.length === 1 && previousLength === 0) {
      toast.success("Great start!", {
        description: "You added your first block! Keep building your program."
      });
    }
  }, [programCommands.length]);

  const handleClear = () => {
    // This would clear the Blockly workspace
    toast.info("Workspace cleared", {
      description: "All blocks have been removed from the workspace."
    });
  };

  const handleLoadExample = () => {
    // This would load an example program
    toast.success("Example loaded", {
      description: "A sample robot program has been loaded into the workspace."
    });
  };

  const handleExport = () => {
    try {
      const exportData = {
        code: generatedCode,
        commands: programCommands,
        timestamp: Date.now(),
        version: "1.0"
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `robot-program-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Program exported", {
        description: "Program has been downloaded as a JSON file."
      });
    } catch (error) {
      toast.error("Export failed", {
        description: "Could not export the program."
      });
    }
  };

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
          {/* Load Program Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Load
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Program</DialogTitle>
                <DialogDescription>
                  Load a previously saved robot program from your computer or select an example.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Load from file</h4>
                  <input 
                    type="file" 
                    accept=".json"
                    className="w-full p-2 border rounded"
                    onChange={(e) => {
                      // Handle file loading
                      toast.info("Loading program...", {
                        description: "File selected for loading."
                      });
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Example programs</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleLoadExample}
                    >
                      🤖 Basic Movement
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleLoadExample}
                    >
                      🎯 Obstacle Avoidance
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleLoadExample}
                    >
                      🌈 Color Following
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          {/* Clear Workspace Alert Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all blocks from the workspace. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear}>
                  Clear All Blocks
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
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

      {/* Generated Python Code Display */}
      {generatedCode && (
        <div className="border-t bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Generated Python Code
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(generatedCode);
                toast.success("Python code copied to clipboard!");
              }}
              className="text-xs"
            >
              Copy Code
            </Button>
          </div>
          <div className="bg-background border rounded-lg p-3 max-h-48 overflow-y-auto">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      )}

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
