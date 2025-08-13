"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
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
  ArrowDown
} from "lucide-react";

export default function BlocklyPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleRun = () => {
    setIsRunning(!isRunning);
    // This would execute the blocks program on the controller
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Save blockly workspace
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
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
                  Motion
                </h4>
                <div className="space-y-2">
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
                    Read Distance
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Read Color
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-800 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Touch Sensor
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
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Grid3X3 className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Blockly Workspace</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Drag blocks from the palette to build your robot program visually
              </p>
              <div className="text-sm text-muted-foreground">
                This will be replaced with the actual Blockly editor
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isRunning ? 'Program Running' : 'Ready'}</span>
          </div>
          <div className="text-muted-foreground">
            Controller: {isRunning ? 'Executing' : 'Connected'}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Blocks: 0 | Last saved: Never
        </div>
      </div>
    </div>
  );
}
