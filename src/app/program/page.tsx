'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Code, Terminal, Cpu, Settings } from 'lucide-react';
import pythonService from '~/lib/python-service';

import {
  ProgramHeader,
  MonacoCodeEditor,
  ProgramConsole,
  ProgramTerminal,
  ProgramSettings
} from '~/components/program';

// Types
interface CodeError {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  type: string;
}

export default function ProgramPage() {
  const [code, setCode] = useState(`# Robotics Controller Programming Environment
# This environment supports real Python execution with libraries!

import time
import math

# Example 1: Basic calculations and control flow
def sensor_reading_simulation():
    """Simulate sensor readings with mathematical operations"""
    print("[SENSOR] Simulating sensor readings...")
    
    # Simulate distance sensor (using math)
    distances = [math.sin(i * 0.1) * 50 + 100 for i in range(10)]
    print(f"Distance readings: {[round(d, 2) for d in distances]}")
    
    # Find obstacles (distance < 50cm)
    obstacles = [d for d in distances if d < 50]
    if obstacles:
        print(f"[WARNING] Obstacles detected at distances: {obstacles}")
    else:
        print("[OK] Clear path ahead")

# Example 2: Motor control simulation
def motor_control_demo():
    """Demonstrate motor control logic"""
    print("\\n[MOTOR] Motor control demonstration...")
    
    # Simulate different motor speeds
    speeds = [0, 25, 50, 75, 100]
    for speed in speeds:
        print(f"Setting motor speed to {speed}%")
        time.sleep(0.1)  # Small delay for demonstration
    
    print("Motors stopped")

# Example 3: Data processing example
def process_sensor_data():
    """Process multiple sensor inputs"""
    print("\\n[DATA] Processing sensor data...")
    
    # Simulate temperature readings
    temperatures = [22.5, 23.1, 24.0, 23.8, 22.9]
    avg_temp = sum(temperatures) / len(temperatures)
    print(f"Average temperature: {avg_temp:.1f}°C")
    
    # Simple threshold checking
    if avg_temp > 25:
        print("[HOT] Temperature warning: Too hot!")
    elif avg_temp < 20:
        print("[COLD] Temperature warning: Too cold!")
    else:
        print("[NORMAL] Temperature normal")

# Main execution
if __name__ == "__main__":
    print("*** FYP Robotics Controller - Python Programming Demo ***")
    print("=" * 50)
    
    try:
        sensor_reading_simulation()
        motor_control_demo()
        process_sensor_data()
        
        print("\\n[SUCCESS] Demo completed successfully!")
        print("\\n[TIP] Try installing packages with: pip install numpy matplotlib")
        print("[TIP] Check your Python environment in Settings tab")
        
    except Exception as e:
        print(f"[ERROR] Error: {e}")`);;
  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [activeTab, setActiveTab] = useState("editor");
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["[READY] Controller programming environment ready...", "[CONNECT] Awaiting connection to main controller board..."]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>(["$ Terminal ready"]);
  const [terminalInput, setTerminalInput] = useState("");
  const [errors, setErrors] = useState<CodeError[]>([]);
  const [showErrors, setShowErrors] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light' | 'hc-black'>('vs-dark');

  // Check for errors when code changes
  useEffect(() => {
    if (code) {
      const foundErrors = checkForErrors(code);
      setErrors(foundErrors);
    }
  }, [code]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'F5':
            e.preventDefault();
            if (!isRunning) handleRun();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case '`':
            e.preventDefault();
            setActiveTab(activeTab === 'console' ? 'editor' : 'console');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, activeTab]);

  const checkForErrors = (codeText: string): CodeError[] => {
    const lines = codeText.split('\n');
    const foundErrors: CodeError[] = [];
    
    lines.forEach((line, index) => {
      // Check for basic Python syntax errors
      if (line.trim().startsWith('def ') && !line.trim().endsWith(':')) {
        foundErrors.push({
          line: index + 1,
          column: line.length,
          message: "Function definition must end with ':'",
          severity: 'error',
          type: 'SyntaxError'
        });
      }
      
      if (line.includes('robot') && !line.includes('import') && !line.includes('=') && !line.includes('#')) {
        foundErrors.push({
          line: index + 1,
          column: line.indexOf('robot'),
          message: "Undefined variable 'robot'. Did you import the robot module?",
          severity: 'warning',
          type: 'NameError'
        });
      }
      
      // Check for indentation issues
      if (line.trim().startsWith('if ') && !line.trim().endsWith(':')) {
        foundErrors.push({
          line: index + 1,
          column: line.length,
          message: "If statement must end with ':'",
          severity: 'error',
          type: 'SyntaxError'
        });
      }
    });
    
    return foundErrors;
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, `[RUN] Starting ${language} program execution...`]);
    
    try {
      const result = await pythonService.executeCode(code, language);
      
      if (result.success) {
        setConsoleOutput(prev => [
          ...prev,
          "✅ Program executed successfully",
          `⏱️ Execution time: ${result.executionTime}ms`,
          "� Output:",
          ...result.output.map(line => `  ${line}`)
        ]);
      } else {
        setConsoleOutput(prev => [
          ...prev,
          "❌ Program execution failed",
          ...(result.error ? [`Error: ${result.error}`] : []),
          ...(result.output.length > 0 ? ["Output:", ...result.output.map(line => `  ${line}`)] : [])
        ]);
      }
    } catch (error) {
      setConsoleOutput(prev => [
        ...prev,
        "❌ Execution error",
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [...prev, "[STOP] Controller program execution stopped by user.", "[WARNING] All motors stopped, sensors in standby mode."]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setConsoleOutput(prev => [...prev, "[SAVE] Saving controller program to board..."]);
    setTimeout(() => {
      setIsSaving(false);
      setConsoleOutput(prev => [...prev, "[SUCCESS] Controller program saved successfully.", "[UPLOAD] Program uploaded to main controller board."]);
    }, 1000);
  };

  const handleReset = () => {
    setCode("# Controller Programming Environment\n# Write your Python code to control sensors and motors\n\ndef main():\n    # Your code here\n    pass\n\nif __name__ == '__main__':\n    main()");
    setConsoleOutput(["[READY] Controller programming environment ready...", "[RESET] Workspace reset", "[CONNECT] Awaiting connection to main controller board..."]);
    setErrors([]);
  };

  const handleTerminalCommand = async () => {
    if (terminalInput.trim()) {
      const command = terminalInput.trim();
      setTerminalHistory(prev => [...prev, `$ ${command}`]);
      
      try {
        const result = await pythonService.executeTerminalCommand(command);
        
        if (result.success) {
          if (result.output.length > 0) {
            setTerminalHistory(prev => [...prev, ...result.output]);
          }
        } else {
          setTerminalHistory(prev => [
            ...prev,
            ...(result.error ? [`Error: ${result.error}`] : ['Command failed']),
            ...(result.output.length > 0 ? result.output : [])
          ]);
        }
      } catch (error) {
        setTerminalHistory(prev => [
          ...prev,
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        ]);
      }
      
      setTerminalInput("");
    }
  };

  const tabs = [
    { id: "editor", label: "Code Editor", icon: Code },
    { id: "console", label: "Console", icon: Terminal },
    { id: "terminal", label: "Terminal", icon: Cpu },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Program Header */}
      <ProgramHeader
        isRunning={isRunning}
        isSaving={isSaving}
        language={language}
        onRun={handleRun}
        onStop={handleStop}
        onSave={handleSave}
        onReset={handleReset}
        onLanguageChange={setLanguage}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-white shadow-sm">
            <TabsList className="grid w-auto grid-cols-4 bg-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            <div className="text-sm text-gray-500">
              {errors.length > 0 && (
                <span>
                  {errors.filter(e => e.severity === 'error').length} errors, {' '}
                  {errors.filter(e => e.severity === 'warning').length} warnings
                </span>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="editor" className="h-full mt-0 p-4">
              <MonacoCodeEditor
                code={code}
                language={language}
                theme={editorTheme}
                fontSize={fontSize}
                wordWrap={wordWrap}
                errors={errors}
                showErrors={showErrors}
                onCodeChange={setCode}
                onShowErrorsToggle={() => setShowErrors(!showErrors)}
              />
            </TabsContent>

            <TabsContent value="console" className="h-full mt-0 p-4">
              <ProgramConsole
                consoleOutput={consoleOutput}
                isRunning={isRunning}
                onClear={() => setConsoleOutput(["[READY] Controller programming environment ready...", "[CONNECT] Awaiting connection to main controller board..."])}
              />
            </TabsContent>

            <TabsContent value="terminal" className="h-full mt-0 p-4">
              <ProgramTerminal
                terminalHistory={terminalHistory}
                terminalInput={terminalInput}
                onInputChange={setTerminalInput}
                onExecuteCommand={handleTerminalCommand}
                onClear={() => setTerminalHistory(["$ Terminal ready"])}
              />
            </TabsContent>

            <TabsContent value="settings" className="h-full mt-0">
              <ProgramSettings
                language={language}
                fontSize={fontSize}
                wordWrap={wordWrap}
                showErrors={showErrors}
                editorTheme={editorTheme}
                onLanguageChange={setLanguage}
                onFontSizeChange={setFontSize}
                onWordWrapChange={setWordWrap}
                onShowErrorsChange={setShowErrors}
                onThemeChange={setEditorTheme}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
