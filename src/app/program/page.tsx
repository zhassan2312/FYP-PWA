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
  Code,
  FileText,
  Terminal,
  Eye,
  EyeOff
} from "lucide-react";

export default function ProgramPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [language, setLanguage] = useState<"python" | "javascript">("python");

  const handleRun = () => {
    setIsRunning(!isRunning);
    // This would execute the code on the controller
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Save code
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const sampleCode = {
    python: `# Robot Control Program
from robot import *

# Initialize robot
robot = Robot()

# Main program
def main():
    print("Starting robot program...")
    
    # Move forward for 2 seconds
    robot.move_forward(50)  # 50% power
    robot.wait(2000)  # Wait 2 seconds
    
    # Check distance sensor
    distance = robot.read_ultrasonic()
    print(f"Distance: {distance} cm")
    
    if distance < 20:
        robot.turn_left(50)
        robot.wait(1000)
    
    robot.stop()
    print("Program finished")

# Run the program
if __name__ == "__main__":
    main()`,
    
    javascript: `// Robot Control Program
const robot = require('./robot');

// Initialize robot
const myRobot = new robot.Robot();

// Main program
async function main() {
    console.log("Starting robot program...");
    
    // Move forward for 2 seconds
    myRobot.moveForward(50); // 50% power
    await myRobot.wait(2000); // Wait 2 seconds
    
    // Check distance sensor
    const distance = myRobot.readUltrasonic();
    console.log(\`Distance: \${distance} cm\`);
    
    if (distance < 20) {
        myRobot.turnLeft(50);
        await myRobot.wait(1000);
    }
    
    myRobot.stop();
    console.log("Program finished");
}

// Run the program
main().catch(console.error);`
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Text Programming</h1>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="px-2 py-1 border border-input bg-background rounded text-sm"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
            <Badge variant="outline">
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConsole(!showConsole)}
          >
            {showConsole ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Console
          </Button>
          
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
            <FileText className="h-4 w-4 mr-2" />
            New
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
        {/* Code Editor */}
        <div className="flex-1 bg-background">
          <div className="h-full p-4">
            {/* This would be replaced with Monaco Editor */}
            <div className="h-full border rounded-lg bg-muted/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-background border-b p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">main.{language === 'python' ? 'py' : 'js'}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Line 1, Column 1
                </div>
              </div>
              
              <div className="pt-12 p-4 h-full overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {sampleCode[language]}
                </pre>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
                  Monaco Editor will be integrated here
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - API Reference */}
        <div className="w-80 border-l bg-card overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Robot API Reference</h3>
            
            <div className="space-y-4">
              {/* Motion Functions */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Motion Control</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">move_forward(power)</code>
                    <p className="text-xs text-muted-foreground mt-1">Move robot forward at specified power (0-100)</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">move_backward(power)</code>
                    <p className="text-xs text-muted-foreground mt-1">Move robot backward</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">turn_left(power)</code>
                    <p className="text-xs text-muted-foreground mt-1">Turn robot left</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">turn_right(power)</code>
                    <p className="text-xs text-muted-foreground mt-1">Turn robot right</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">stop()</code>
                    <p className="text-xs text-muted-foreground mt-1">Stop all motors</p>
                  </div>
                </div>
              </div>

              {/* Sensor Functions */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Sensors</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">read_ultrasonic()</code>
                    <p className="text-xs text-muted-foreground mt-1">Get distance in centimeters</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">read_color()</code>
                    <p className="text-xs text-muted-foreground mt-1">Get detected color</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">is_touch_pressed()</code>
                    <p className="text-xs text-muted-foreground mt-1">Check if touch sensor is pressed</p>
                  </div>
                </div>
              </div>

              {/* Utility Functions */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Utilities</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">wait(milliseconds)</code>
                    <p className="text-xs text-muted-foreground mt-1">Pause execution</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">beep()</code>
                    <p className="text-xs text-muted-foreground mt-1">Play a beep sound</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <code className="font-mono">print(message)</code>
                    <p className="text-xs text-muted-foreground mt-1">Output to console</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Console */}
      {showConsole && (
        <div className="h-48 border-t bg-card">
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <h4 className="font-medium">Console Output</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsole(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 font-mono text-sm bg-background h-full overflow-y-auto">
            <div className="text-muted-foreground">
              {isRunning ? (
                <>
                  <div className="text-green-600">Starting robot program...</div>
                  <div>Moving forward...</div>
                  <div>Distance: 45 cm</div>
                  <div className="text-blue-600">Program running...</div>
                </>
              ) : (
                <div>Console ready. Click "Run" to execute your program.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="border-t bg-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isRunning ? 'Program Running' : 'Ready'}</span>
          </div>
          <div className="text-muted-foreground">
            Controller: {isRunning ? 'Executing' : 'Connected'} | Language: {language}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Lines: {sampleCode[language].split('\n').length} | Last saved: Never
        </div>
      </div>
    </div>
  );
}
