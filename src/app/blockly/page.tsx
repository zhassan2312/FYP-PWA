'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Progress } from '~/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { TooltipProvider } from '~/components/ui/tooltip';
import { Textarea } from '~/components/ui/textarea';
import { 
  Play, 
  Square, 
  Code, 
  Terminal, 
  Settings, 
  Zap, 
  Eye, 
  Bot, 
  Activity, 
  Cpu,
  Layers,
  Maximize,
  Minimize,
  Info,
  Save,
  FolderOpen,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Monitor
} from 'lucide-react';

import { BlocklyWorkspace, ROBOT_TOOLBOX } from '~/components/blockly-workspace';
import { robotService, type RobotStatus, type RobotCommand } from '~/lib/robot-service';
import { generatePythonCode } from '~/lib/blockly-python-generator';

export default function BlocklyPage() {
  const [activeTab, setActiveTab] = useState('blockly');
  const [generatedCode, setGeneratedCode] = useState('');
  const [robotCommands, setRobotCommands] = useState<RobotCommand[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [robotStatus, setRobotStatus] = useState<RobotStatus>({
    connected: false,
    running: false,
    position: { x: 0, y: 0, angle: 0 },
    sensors: {},
    motors: {
      left: { power: 0, direction: 'stop' },
      right: { power: 0, direction: 'stop' }
    },
    servos: {},
    lastUpdate: 0
  });
  const [executionError, setExecutionError] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '🤖 Robot Console Ready',
    '📡 Waiting for connection...',
    '💡 Start building blocks to see generated code'
  ]);
  const workspaceRef = useRef<any>(null);

  // Initialize robot status on client side only to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
    setRobotStatus(robotService.getStatus());
  }, []);

  // Subscribe to robot status updates
  useEffect(() => {
    const handleStatusChange = (status: RobotStatus) => {
      setRobotStatus(status);
      
      // Add status changes to console
      if (status.error) {
        setConsoleOutput(prev => [...prev, `❌ Robot Error: ${status.error}`]);
        setExecutionError(status.error);
      }
    };
    
    robotService.onStatusChange(handleStatusChange);
    
    return () => {
      robotService.removeStatusListener(handleStatusChange);
    };
  }, []);

  // Handle code generation from Blockly workspace
  const handleCodeChange = (code: string) => {
    setGeneratedCode(code);
    setExecutionError(''); // Clear any previous errors
    if (code.trim()) {
      setConsoleOutput(prev => [...prev, `🔄 Code updated (${code.split('\n').length} lines)`]);
    }
  };

  // Handle robot commands generation from Blockly workspace
  const handleProgramChange = (commands: RobotCommand[]) => {
    setRobotCommands(commands);
    if (commands.length > 0) {
      setConsoleOutput(prev => [...prev, `� Program updated (${commands.length} commands)`]);
    }
  };

  // Execute program handler
  const handleExecute = async () => {
    // Improved validation
    const hasBlocks = robotCommands.length > 0;
    const hasCode = generatedCode.trim() && !generatedCode.includes('pass  # No blocks added yet');
    
    if (!hasBlocks && !hasCode) {
      setConsoleOutput(prev => [...prev, '⚠️ No program to execute. Drag blocks to the workspace first!']);
      return;
    }
    
    if (!robotStatus.connected) {
      setConsoleOutput(prev => [...prev, '⚠️ Robot not connected. Using simulation mode.']);
    }

    setIsRunning(true);
    setExecutionError('');
    setConsoleOutput(prev => [...prev, `🚀 Starting execution...`]);
    
    try {
      if (hasBlocks) {
        setConsoleOutput(prev => [...prev, `📋 Executing ${robotCommands.length} robot commands`]);
        await robotService.executeProgram(robotCommands);
        setConsoleOutput(prev => [...prev, `✅ Program completed successfully`]);
      } else if (hasCode) {
        // Show generated code simulation
        setConsoleOutput(prev => [...prev, `⚡ Simulating Python code execution...`]);
        setConsoleOutput(prev => [...prev, `📄 Generated ${generatedCode.split('\n').length} lines of code`]);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setConsoleOutput(prev => [...prev, `✅ Code simulation completed`]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setExecutionError(errorMessage);
      setConsoleOutput(prev => [...prev, `❌ Execution Error: ${errorMessage}`]);
    } finally {
      setIsRunning(false);
    }
  };

  // Stop execution handler
  const handleStop = () => {
    robotService.stopProgram();
    setIsRunning(false);
    setExecutionError('');
    setConsoleOutput(prev => [...prev, `⏹️ Program stopped by user`]);
  };

  // File operations
  const handleSave = () => {
    // TODO: Implement actual save functionality
    const projectData = {
      blocks: workspaceRef.current ? 'xml_data' : null, // Would save actual XML
      code: generatedCode,
      commands: robotCommands,
      timestamp: new Date().toISOString()
    };
    
    // For now, just download as JSON
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robot_project_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setConsoleOutput(prev => [...prev, `💾 Project saved successfully`]);
  };

  const handleLoad = () => {
    // TODO: Implement actual load functionality
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target?.result as string);
            setGeneratedCode(projectData.code || '');
            setRobotCommands(projectData.commands || []);
            setConsoleOutput(prev => [...prev, `📂 Project loaded: ${file.name}`]);
          } catch (error) {
            setConsoleOutput(prev => [...prev, `❌ Failed to load project: Invalid file format`]);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    setGeneratedCode('');
    setRobotCommands([]);
    setExecutionError('');
    // TODO: Clear the actual Blockly workspace
    setConsoleOutput(prev => [...prev, `🗑️ Workspace cleared`]);
  };

  const handleExport = () => {
    if (!generatedCode.trim()) {
      setConsoleOutput(prev => [...prev, `⚠️ No code to export. Add some blocks first!`]);
      return;
    }
    
    const element = document.createElement('a');
    const file = new Blob([generatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `robot_program_${Date.now()}.py`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setConsoleOutput(prev => [...prev, `📥 Python code exported successfully`]);
  };

  // Clear console
  const handleClearConsole = () => {
    setConsoleOutput(['🤖 Console cleared']);
  };

  // Connect/disconnect robot
  const handleToggleConnection = async () => {
    if (robotStatus.connected) {
      robotService.disconnect();
      setConsoleOutput(prev => [...prev, `🔌 Disconnected from robot`]);
    } else {
      try {
        await robotService.connect();
        setConsoleOutput(prev => [...prev, `🔌 Connected to robot successfully`]);
      } catch (error) {
        setConsoleOutput(prev => [...prev, `❌ Connection failed: ${error}`]);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Workspace */}
          <div className="flex-1 flex flex-col border-r">
            <div className="border-b bg-background/95 backdrop-blur">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between px-4 py-2">
                  <TabsList className="grid w-auto grid-cols-4 h-9">
                    <TabsTrigger value="blockly" className="flex items-center gap-2 px-3 text-sm">
                      <Layers className="h-4 w-4" />
                      Blockly
                    </TabsTrigger>
                    <TabsTrigger value="python" className="flex items-center gap-2 px-3 text-sm">
                      <Code className="h-4 w-4" />
                      Python Code
                    </TabsTrigger>
                    <TabsTrigger value="console" className="flex items-center gap-2 px-3 text-sm">
                      <Terminal className="h-4 w-4" />
                      Console
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 px-3 text-sm">
                      <Settings className="h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* File Operations */}
                    <div className="flex items-center gap-1 border-r pr-2 mr-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLoad}
                        className="text-xs h-8"
                      >
                        <FolderOpen className="h-3 w-3 mr-1" />
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSave}
                        className="text-xs h-8"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExport}
                        disabled={!generatedCode.trim()}
                        className="text-xs h-8"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 border-r pr-2 mr-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleClear}
                        className="text-xs h-8"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleToggleConnection}
                        className="text-xs h-8"
                      >
                        <Monitor className="h-3 w-3 mr-1" />
                        {robotStatus.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>

                    {/* Execution Controls */}
                    <Button
                      onClick={isRunning ? handleStop : handleExecute}
                      variant={isRunning ? "destructive" : "default"}
                      size="sm"
                      disabled={!isRunning && !robotCommands.length && (!generatedCode.trim() || generatedCode.includes('pass  # No blocks added yet'))}
                      className="min-w-20 h-8"
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="h-8"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="blockly" className="flex-1 h-full m-0 p-0">
                    <div className="h-[calc(100vh-120px)] bg-gradient-to-br from-muted/20 to-muted/40 relative">
                      <BlocklyWorkspace 
                        toolboxConfig={ROBOT_TOOLBOX}
                        onCodeChange={handleCodeChange}
                        onProgramChange={handleProgramChange}
                      />
                      
                      {/* Enhanced Empty State Overlay */}
                      {(!generatedCode || generatedCode.includes('pass  # No blocks added yet')) && !isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <Card className="p-8 bg-background/95 backdrop-blur border-dashed max-w-lg text-center shadow-xl">
                            <div className="animate-bounce mb-4">
                              <Layers className="h-16 w-16 mx-auto text-primary/60" />
                            </div>
                            <h3 className="font-bold mb-3 text-xl text-foreground">Ready to Program!</h3>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                              Drag blocks from the toolbox to create your robot program. 
                              Watch your code generate automatically!
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                              <div className="flex flex-col items-center gap-1 p-2 rounded bg-muted/30">
                                <Zap className="h-5 w-5 text-blue-500" />
                                <span className="font-medium">Motors</span>
                                <span className="text-xs opacity-75">Movement & Control</span>
                              </div>
                              <div className="flex flex-col items-center gap-1 p-2 rounded bg-muted/30">
                                <Eye className="h-5 w-5 text-green-500" />
                                <span className="font-medium">Sensors</span>
                                <span className="text-xs opacity-75">Environment Data</span>
                              </div>
                              <div className="flex flex-col items-center gap-1 p-2 rounded bg-muted/30">
                                <Cpu className="h-5 w-5 text-purple-500" />
                                <span className="font-medium">Logic</span>
                                <span className="text-xs opacity-75">Control Flow</span>
                              </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/50">
                              <p className="text-xs text-muted-foreground">
                                💡 Tip: Start with a simple forward movement and build from there
                              </p>
                            </div>
                          </Card>
                        </div>
                      )}
                      
                      {/* Enhanced Error State Overlay */}
                      {executionError && (
                        <div className="absolute top-4 right-4 z-20">
                          <Card className="p-4 bg-destructive/10 border-destructive/50 max-w-sm backdrop-blur">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 animate-pulse" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-destructive text-sm mb-1">Execution Error</h4>
                                <p className="text-xs text-destructive/90 mb-3 leading-relaxed">{executionError}</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setExecutionError('')}
                                  className="h-7 text-xs"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Running State Indicator */}
                      {isRunning && (
                        <div className="absolute top-4 left-4 z-20">
                          <Card className="p-3 bg-blue-500/10 border-blue-500/50 backdrop-blur">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Program Running...
                              </span>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                <TabsContent value="python" className="flex-1 h-full m-0 p-0">
                  <div className="h-[calc(100vh-120px)] flex flex-col">
                    <div className="border-b p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2 text-base">
                          <Code className="h-5 w-5" />
                          Generated Python Code
                        </h3>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {generatedCode ? generatedCode.split('\n').length : 0} lines
                          </Badge>
                          {robotCommands.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {robotCommands.length} commands
                            </Badge>
                          )}
                          {generatedCode.trim() && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleExport}
                              className="text-xs h-7"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Export .py
                            </Button>
                          )}
                        </div>
                      </div>
                      {generatedCode.trim() && (
                        <p className="text-xs text-muted-foreground mt-2">
                          ✨ Code automatically generated from your blocks. Ready to run on robot!
                        </p>
                      )}
                    </div>
                    <div className="flex-1 overflow-auto bg-slate-950 text-slate-100 relative">
                      {generatedCode.trim() ? (
                        <pre className="p-6 text-sm font-mono h-full">
                          <code className="language-python whitespace-pre-wrap">
                            {generatedCode}
                          </code>
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center max-w-md p-6">
                            <Code className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                            <h3 className="text-lg font-semibold text-slate-300 mb-3">No Code Generated Yet</h3>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                              Start building with blocks in the Blockly tab. Your Python code will appear here automatically as you add blocks.
                            </p>
                            <div className="bg-slate-900 rounded-lg p-4 text-left">
                              <div className="text-xs text-slate-400 mb-2"># Example program structure:</div>
                              <div className="text-slate-300 font-mono text-xs space-y-1">
                                <div><span className="text-purple-400">import</span> <span className="text-blue-300">time</span></div>
                                <div><span className="text-purple-400">from</span> <span className="text-blue-300">robot_controller</span> <span className="text-purple-400">import</span> <span className="text-green-300">RobotController</span></div>
                                <div className="mt-2">
                                  <span className="text-yellow-300">robot</span> = <span className="text-green-300">RobotController</span>()
                                </div>
                                <div className="mt-2">
                                  <span className="text-purple-400">def</span> <span className="text-yellow-300">main</span>():
                                </div>
                                <div className="pl-4 text-slate-400"># Your blocks will generate code here</div>
                              </div>
                            </div>
                            <Button
                              onClick={() => setActiveTab('blockly')}
                              variant="outline"
                              size="sm"
                              className="mt-4"
                            >
                              <Layers className="h-4 w-4 mr-2" />
                              Start Building Blocks
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="console" className="flex-1 h-full m-0 p-0">
                  <div className="h-[calc(100vh-120px)] flex flex-col">
                    <div className="border-b p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2 text-base">
                          <Terminal className="h-5 w-5" />
                          Robot Console
                        </h3>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {consoleOutput.length} messages
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${robotStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-muted-foreground">
                              {robotStatus.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleClearConsole}
                            className="text-xs h-7"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-slate-950 text-green-400 relative">
                      <div className="p-4 font-mono text-sm space-y-2">
                        {consoleOutput.map((line, index) => (
                          <div key={index} className="flex items-start gap-3 group hover:bg-slate-900/50 px-2 py-1 rounded">
                            <span className="text-slate-500 text-xs select-none font-medium min-w-[2rem] text-right">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="flex-1 leading-relaxed">{line}</span>
                            {/* Only show timestamp on hover and after hydration to avoid SSR mismatch */}
                            {isClient && (
                              <span className="text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                {new Date().toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        ))}
                        
                        {/* Enhanced Running Indicator */}
                        {isRunning && (
                          <div className="flex items-center gap-3 text-yellow-400 animate-pulse bg-yellow-500/10 px-2 py-2 rounded border border-yellow-500/30">
                            <Activity className="h-4 w-4" />
                            <span className="font-medium">Program executing...</span>
                            <div className="flex gap-1 ml-auto">
                              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Error Display */}
                        {executionError && (
                          <div className="flex items-start gap-3 text-red-400 bg-red-500/10 px-2 py-2 rounded border border-red-500/30">
                            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium">Latest Error:</div>
                              <div className="text-sm text-red-300 mt-1">{executionError}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Input prompt simulation */}
                        <div className="flex items-center gap-3 text-blue-400 mt-4">
                          <span className="text-slate-500 text-xs select-none font-medium min-w-[2rem] text-right">
                            &gt;
                          </span>
                          <span className="flex-1 opacity-50">Ready for next command...</span>
                          <div className="w-2 h-4 bg-blue-400 animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* Empty state for console */}
                      {consoleOutput.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-slate-500">
                            <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Console output will appear here</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="flex-1 h-full m-0 p-0">
                  <div className="h-[calc(100vh-120px)] p-6 overflow-auto">
                    <div className="max-w-2xl space-y-6">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-6 text-lg">
                          <Settings className="h-5 w-5" />
                          Robot Configuration
                        </h3>
                        <div className="grid gap-4">
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <Bot className="h-4 w-4" />
                              Connection Settings
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Robot IP:</span>
                                <span className="font-mono">192.168.1.100</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Port:</span>
                                <span className="font-mono">8080</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Protocol:</span>
                                <span className="font-mono">WebSocket</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant={robotStatus.connected ? 'default' : 'destructive'}>
                                  {robotStatus.connected ? 'Connected' : 'Disconnected'}
                                </Badge>
                              </div>
                            </div>
                          </Card>
                          
                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Motor Configuration
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Left Motor:</span>
                                <span className="font-mono">Port A</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Right Motor:</span>
                                <span className="font-mono">Port B</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Max Speed:</span>
                                <span className="font-mono">100%</span>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4">
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Sensor Configuration
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Ultrasonic:</span>
                                <span className="font-mono">Port 1</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Color Sensor:</span>
                                <span className="font-mono">Port 2</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Gyro:</span>
                                <span className="font-mono">Port 3</span>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Robot Status (only when not fullscreen) */}
        {!isFullscreen && (
          <div className="w-80 border-l bg-card/95 backdrop-blur overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Enhanced Robot Status Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <Bot className="h-5 w-5" />
                  Robot Status
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    robotStatus.connected ? 'bg-green-500 shadow-green-500/50 shadow-lg' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {robotStatus.connected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Enhanced Connection Status */}
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Connection</span>
                  <Badge variant={robotStatus.connected ? 'default' : 'destructive'} className="text-xs">
                    {robotStatus.connected ? 'Active' : 'Offline'}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{robotStatus.connected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Program:</span>
                    <span className={`font-medium ${robotStatus.running ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {robotStatus.running ? 'Running' : 'Idle'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span className="font-mono text-xs">
                      {robotStatus.lastUpdate ? new Date(robotStatus.lastUpdate).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={robotStatus.connected ? 100 : 0} 
                  className="h-2 mt-3" 
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Signal Strength</span>
                  <span>{robotStatus.connected ? '100%' : '0%'}</span>
                </div>
              </Card>

              {/* Enhanced Motor Status */}
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Motor Control
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Left Motor</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {robotStatus.motors.left.power}%
                        </Badge>
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          robotStatus.motors.left.direction !== 'stop' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Direction: {robotStatus.motors.left.direction}</span>
                    </div>
                    <div className="space-y-1">
                      <Progress value={Math.abs(robotStatus.motors.left.power)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Right Motor</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {robotStatus.motors.right.power}%
                        </Badge>
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          robotStatus.motors.right.direction !== 'stop' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Direction: {robotStatus.motors.right.direction}</span>
                    </div>
                    <div className="space-y-1">
                      <Progress value={Math.abs(robotStatus.motors.right.power)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Enhanced Sensor Status */}
              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Sensor Readings
                </h4>
                <div className="space-y-3">
                  {robotStatus.sensors.ultrasonic !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                        <div>
                          <div className="text-xs font-semibold">Ultrasonic</div>
                          <div className="text-xs text-muted-foreground">Distance Sensor</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{robotStatus.sensors.ultrasonic.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">cm</div>
                      </div>
                    </div>
                  )}
                  {robotStatus.sensors.temperature !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <div>
                          <div className="text-xs font-semibold">Temperature</div>
                          <div className="text-xs text-muted-foreground">Environment</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{robotStatus.sensors.temperature.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">°C</div>
                      </div>
                    </div>
                  )}
                  {robotStatus.sensors.color && (
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full border"
                          style={{ 
                            backgroundColor: `rgb(${robotStatus.sensors.color.r}, ${robotStatus.sensors.color.g}, ${robotStatus.sensors.color.b})`
                          }}
                        />
                        <div>
                          <div className="text-xs font-semibold">Color RGB</div>
                          <div className="text-xs text-muted-foreground">Detection</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono">
                          {robotStatus.sensors.color.r},{robotStatus.sensors.color.g},{robotStatus.sensors.color.b}
                        </div>
                      </div>
                    </div>
                  )}
                  {robotStatus.sensors.touch && (
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <div>
                          <div className="text-xs font-semibold">Touch Sensors</div>
                          <div className="text-xs text-muted-foreground">Digital Input</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {robotStatus.sensors.touch.map((pressed, index) => (
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
                  {Object.keys(robotStatus.sensors).length === 0 && (
                    <div className="text-center py-6">
                      <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <div className="text-xs text-muted-foreground">No sensor data available</div>
                      <div className="text-xs text-muted-foreground mt-1">Connect robot to see readings</div>
                    </div>
                  )}
                </div>
              </Card>

              {/* System Information */}
              <Card className="p-3">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  System Info
                </h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Firmware: v1.10E</div>
                  <div>Uptime: {isClient && robotStatus.lastUpdate > 0 ? Math.floor((Date.now() - robotStatus.lastUpdate) / 1000) : 0}s</div>
                  <div>Memory: 85% used</div>
                  <div>CPU: 12% load</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        
      </div>
      {/* Status Bar */}
        <div className="border-t bg-background/95 backdrop-blur-sm p-3 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isRunning ? 'bg-green-500 animate-pulse' : 
                robotStatus.connected ? 'bg-blue-500' : 
                'bg-gray-400'
              }`} />
              <span className="font-medium">
                {isRunning ? 'Program Running' : robotStatus.connected ? 'Robot Connected' : 'Robot Disconnected'}
              </span>
              {isRunning && (
                <Badge variant="outline" className="text-xs animate-pulse bg-green-50 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Executing
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Robot Position: ({robotStatus.position.x.toFixed(1)}, {robotStatus.position.y.toFixed(1)})</span>
              <span>Code Lines: {generatedCode ? generatedCode.split('\n').length : 0}</span>
              <span>Commands: {robotCommands.length}</span>
              <span>Last Update: {robotStatus.lastUpdate ? new Date(robotStatus.lastUpdate).toLocaleTimeString() : 'Never'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Active Tab: {activeTab}</span>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant={activeTab === 'console' ? 'default' : 'outline'}
                onClick={() => setActiveTab('console')}
                className="text-xs h-7"
              >
                <Terminal className="h-3 w-3 mr-1" />
                Console
              </Button>
              <Button 
                size="sm" 
                variant={activeTab === 'python' ? 'default' : 'outline'}
                onClick={() => setActiveTab('python')}
                className="text-xs h-7"
              >
                <Code className="h-3 w-3 mr-1" />
                Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
