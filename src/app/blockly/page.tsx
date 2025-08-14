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
  Monitor,
  Gauge,
  Sun,
  Thermometer,
  Droplets,
  Radar,
  MapPin,
  Clock,
  Maximize2,
  Minimize2
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
      <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Workspace */}
          <div className="flex-1 flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl shadow-sm">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between px-6 py-4">
                  <TabsList className="grid w-auto grid-cols-4 h-11 bg-muted/50 backdrop-blur border border-border/50 shadow-sm">
                    <TabsTrigger value="blockly" className="flex items-center gap-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
                      <Layers className="h-4 w-4" />
                      Blockly
                    </TabsTrigger>
                    <TabsTrigger value="python" className="flex items-center gap-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
                      <Code className="h-4 w-4" />
                      Python Code
                    </TabsTrigger>
                    <TabsTrigger value="console" className="flex items-center gap-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
                      <Terminal className="h-4 w-4" />
                      Console
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
                      <Settings className="h-4 w-4" />
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center gap-3">
                    {/* File Operations */}
                    <div className="flex items-center gap-1.5 border-r border-border/50 pr-3 mr-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleLoad}
                        className="text-xs h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                      >
                        <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleSave}
                        className="text-xs h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                      >
                        <Save className="h-3.5 w-3.5 mr-1.5" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleExport}
                        disabled={!generatedCode.trim()}
                        className="text-xs h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1.5 border-r border-border/50 pr-3 mr-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleClear}
                        className="text-xs h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleToggleConnection}
                        className="text-xs h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                      >
                        <Monitor className="h-3.5 w-3.5 mr-1.5" />
                        {robotStatus.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>

                    {/* Enhanced Execution Controls */}
                    <Button
                      onClick={isRunning ? handleStop : handleExecute}
                      variant={isRunning ? "destructive" : "default"}
                      size="sm"
                      disabled={!isRunning && !robotCommands.length && (!generatedCode.trim() || generatedCode.includes('pass  # No blocks added yet'))}
                      className="min-w-24 h-9 font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
                      variant="ghost"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="h-9 px-3 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="blockly" className="flex-1 h-full m-0 p-0">
                    <div className="h-[calc(100vh-140px)] bg-gradient-to-br from-muted/10 via-background to-muted/20 relative">
                      <BlocklyWorkspace 
                        toolboxConfig={ROBOT_TOOLBOX}
                        onCodeChange={handleCodeChange}
                        onProgramChange={handleProgramChange}
                      />
                      
                      {/* Enhanced Empty State Overlay */}
                      {(!generatedCode || generatedCode.includes('pass  # No blocks added yet')) && !isRunning && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <Card className="p-8 bg-card/95 backdrop-blur-xl border-border/50 max-w-lg text-center shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                            <div className="animate-bounce mb-6">
                              <div className="relative">
                                <Layers className="h-20 w-20 mx-auto text-primary/60" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            </div>
                            <h3 className="font-bold mb-4 text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              Ready to Program!
                            </h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                              Drag blocks from the toolbox to create your robot program. 
                              Watch your code generate automatically as you build!
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground mb-8">
                              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border border-blue-200/50 dark:border-blue-800/50 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                                <Zap className="h-8 w-8 text-blue-500" />
                                <span className="font-semibold text-blue-700 dark:text-blue-300">Motors</span>
                                <span className="text-xs opacity-75 text-center">Movement & Control</span>
                              </div>
                              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border border-green-200/50 dark:border-green-800/50 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                                <Eye className="h-8 w-8 text-green-500" />
                                <span className="font-semibold text-green-700 dark:text-green-300">Sensors</span>
                                <span className="text-xs opacity-75 text-center">Environment Data</span>
                              </div>
                              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border border-purple-200/50 dark:border-purple-800/50 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                                <Cpu className="h-8 w-8 text-purple-500" />
                                <span className="font-semibold text-purple-700 dark:text-purple-300">Logic</span>
                                <span className="text-xs opacity-75 text-center">Control Flow</span>
                              </div>
                            </div>
                            <div className="pt-6 border-t border-border/50">
                              <div className="text-xs text-muted-foreground mb-4 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                                Tip: Start with a simple forward movement and build from there
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="pointer-events-auto text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                onClick={() => {
                                  setConsoleOutput(prev => [...prev, '🎯 Try dragging a "Move Forward" block from the Motor Control section!']);
                                }}
                              >
                                <Info className="h-3 w-3 mr-2" />
                                Show Quick Start Guide
                              </Button>
                            </div>
                          </Card>
                        </div>
                      )}
                      
                      {/* Enhanced Error State Overlay */}
                      {executionError && (
                        <div className="absolute top-6 right-6 z-20 animate-in slide-in-from-right duration-300">
                          <Card className="p-5 bg-destructive/5 border-destructive/30 max-w-sm backdrop-blur-xl shadow-xl">
                            <div className="flex items-start gap-4">
                              <div className="relative">
                                <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-ping"></div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-destructive text-sm mb-2 flex items-center gap-2">
                                  Execution Error
                                  <Badge variant="destructive" className="text-xs">Error</Badge>
                                </h4>
                                <p className="text-xs text-destructive/90 mb-4 leading-relaxed bg-destructive/10 p-2 rounded border">{executionError}</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setExecutionError('')}
                                  className="h-8 text-xs hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1.5" />
                                  Dismiss Error
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}

                      {/* Enhanced Running State Indicator */}
                      {isRunning && (
                        <div className="absolute top-6 left-6 z-20 animate-in slide-in-from-left duration-300">
                          <Card className="p-4 bg-blue-500/10 border-blue-500/30 backdrop-blur-xl shadow-xl">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
                                <div className="absolute inset-0 w-5 h-5 border-2 border-blue-500/30 rounded-full animate-spin"></div>
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 block">
                                  Program Running
                                </span>
                                <span className="text-xs text-blue-600/80 dark:text-blue-400/80">
                                  Executing {robotCommands.length} commands
                                </span>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                <TabsContent value="python" className="flex-1 h-full m-0 p-0">
                  <div className="h-[calc(100vh-140px)] flex flex-col">
                    <div className="border-b border-border/50 p-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Code className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base text-foreground">Generated Python Code</h3>
                            <p className="text-xs text-muted-foreground">Real-time code generation from your blocks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-mono">
                              {generatedCode ? generatedCode.split('\n').length : 0} lines
                            </Badge>
                            {robotCommands.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {robotCommands.length} commands
                              </Badge>
                            )}
                          </div>
                          {generatedCode.trim() && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleExport}
                              className="text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                            >
                              <Download className="h-3 w-3 mr-1.5" />
                              Export .py
                            </Button>
                          )}
                        </div>
                      </div>
                      {generatedCode.trim() && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                          <CheckCircle className="h-3 w-3" />
                          <span>Code automatically generated from your blocks. Ready to run on robot!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative">
                      {generatedCode.trim() ? (
                        <div className="relative">
                          <div className="absolute top-4 right-4 z-10">
                            <Badge variant="outline" className="bg-slate-800/80 text-slate-200 border-slate-600">
                              Python 3.x
                            </Badge>
                          </div>
                          <pre className="p-6 text-sm font-mono h-full leading-relaxed">
                            <code className="language-python whitespace-pre-wrap">
                              {generatedCode}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center max-w-md p-8">
                            <div className="relative mb-6">
                              <Code className="h-20 w-20 mx-auto text-slate-600" />
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Zap className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-300 mb-4">No Code Generated Yet</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                              Start building with blocks in the Blockly tab. Your Python code will appear here automatically as you add blocks.
                            </p>
                            <div className="bg-slate-900/80 rounded-xl p-6 text-left border border-slate-700/50 backdrop-blur">
                              <div className="text-xs text-slate-400 mb-3 font-semibold"># Example program structure:</div>
                              <div className="text-slate-300 font-mono text-xs space-y-2">
                                <div><span className="text-purple-400">import</span> <span className="text-blue-300">time</span></div>
                                <div><span className="text-purple-400">from</span> <span className="text-blue-300">robot_controller</span> <span className="text-purple-400">import</span> <span className="text-green-300">RobotController</span></div>
                                <div className="mt-3">
                                  <span className="text-yellow-300">robot</span> = <span className="text-green-300">RobotController</span>()
                                </div>
                                <div className="mt-3">
                                  <span className="text-purple-400">def</span> <span className="text-yellow-300">main</span>():
                                </div>
                                <div className="pl-4 text-slate-400 italic"># Your blocks will generate code here</div>
                                <div className="pl-4 text-green-300">robot.move('forward', 2)</div>
                                <div className="pl-4 text-blue-300">time.sleep(1)</div>
                                <div className="pl-4 text-green-300">robot.stop_all_motors()</div>
                              </div>
                            </div>
                            <Button
                              onClick={() => setActiveTab('blockly')}
                              variant="outline"
                              size="sm"
                              className="mt-6 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
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
                  <div className="h-[calc(100vh-140px)] flex flex-col">
                    <div className="border-b border-border/50 p-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Terminal className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base text-foreground">Robot Console</h3>
                            <p className="text-xs text-muted-foreground">Real-time execution feedback and system logs</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {consoleOutput.length} messages
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              robotStatus.connected ? 'bg-green-500 shadow-green-500/50 shadow-md animate-pulse' : 'bg-red-500'
                            }`} />
                            <span className="text-xs font-medium text-muted-foreground">
                              {robotStatus.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleClearConsole}
                            className="text-xs h-8 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                          >
                            <Trash2 className="h-3 w-3 mr-1.5" />
                            Clear Console
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-green-400 relative">
                      <div className="p-6 font-mono text-sm space-y-3">
                        {consoleOutput.map((line, index) => (
                          <div key={index} className="flex items-start gap-4 group hover:bg-slate-900/50 px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-700/50">
                            <span className="text-slate-500 text-xs select-none font-medium min-w-[3rem] text-right bg-slate-800/50 px-2 py-1 rounded">
                              {(index + 1).toString().padStart(3, '0')}
                            </span>
                            <span className="flex-1 leading-relaxed">{line}</span>
                            {/* Only show timestamp on hover and after hydration to avoid SSR mismatch */}
                            {isClient && (
                              <span className="text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/30 px-2 py-1 rounded font-mono">
                                {new Date().toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        ))}
                        
                        {/* Enhanced Running Indicator */}
                        {isRunning && (
                          <div className="flex items-center gap-4 text-yellow-400 animate-pulse bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-4 py-3 rounded-lg border border-yellow-500/30 backdrop-blur">
                            <Activity className="h-5 w-5" />
                            <span className="font-medium">Program executing...</span>
                            <div className="flex gap-1.5 ml-auto">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-200 border-yellow-400/50">
                              Active
                            </Badge>
                          </div>
                        )}
                        
                        {/* Enhanced Error Display */}
                        {executionError && (
                          <div className="flex items-start gap-4 text-red-400 bg-gradient-to-r from-red-500/10 to-pink-500/10 px-4 py-3 rounded-lg border border-red-500/30 backdrop-blur">
                            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2 mb-2">
                                Latest Error:
                                <Badge variant="destructive" className="text-xs">Critical</Badge>
                              </div>
                              <div className="text-sm text-red-300 bg-red-500/10 p-3 rounded border border-red-500/30 font-mono">{executionError}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Enhanced Input prompt simulation */}
                        <div className="flex items-center gap-4 text-blue-400 mt-6 bg-blue-500/10 px-4 py-3 rounded-lg border border-blue-500/30">
                          <span className="text-slate-500 text-xs select-none font-medium min-w-[3rem] text-right bg-slate-800/50 px-2 py-1 rounded">
                            &gt;_
                          </span>
                          <span className="flex-1 opacity-75">Ready for next command...</span>
                          <div className="w-3 h-5 bg-blue-400 animate-pulse rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* Enhanced Empty state for console */}
                      {consoleOutput.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-slate-500 p-8">
                            <Terminal className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">Console Ready</h3>
                            <p className="text-sm">Execution output and system messages will appear here</p>
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

        {/* Enhanced Right Panel - Robot Status (only when not fullscreen) */}
        {!isFullscreen && (
          <div className="w-80 border-l border-border/50 bg-gradient-to-b from-card/95 to-card/80 backdrop-blur-xl overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Enhanced Robot Status Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Robot Status</h3>
                    <p className="text-xs text-muted-foreground">Real-time monitoring</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    robotStatus.connected ? 'bg-green-500 shadow-green-500/50 shadow-lg animate-pulse' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-muted-foreground">
                    {robotStatus.connected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Enhanced Connection Status */}
              <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/20 rounded">
                      <Monitor className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Connection</span>
                  </div>
                  <Badge variant={robotStatus.connected ? 'default' : 'destructive'} className="text-xs">
                    {robotStatus.connected ? 'Active' : 'Offline'}
                  </Badge>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{robotStatus.connected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded">
                    <span className="text-muted-foreground">Program:</span>
                    <span className={`font-medium ${robotStatus.running ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {robotStatus.running ? 'Running' : 'Idle'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded">
                    <span className="text-muted-foreground">Last Update:</span>
                    <span className="font-mono text-xs">
                      {robotStatus.lastUpdate ? new Date(robotStatus.lastUpdate).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={robotStatus.connected ? 100 : 0} 
                  className="h-3 mt-4" 
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Signal Strength</span>
                  <span className="font-semibold">{robotStatus.connected ? '100%' : '0%'}</span>
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

              {/* Enhanced Sensor Status with Modern Design */}
              <Card className="p-5 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200/50 dark:border-green-800/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-500/20 rounded">
                      <Eye className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">Sensor Readings</h4>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                    Real-time
                  </Badge>
                </div>
                <div className="space-y-3">
                  {robotStatus.sensors.ultrasonic !== undefined && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 rounded-lg border border-blue-200/50 dark:border-blue-800/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-blue-500/50 shadow-lg animate-pulse" />
                        <div>
                          <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">Ultrasonic</div>
                          <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Distance Sensor</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{robotStatus.sensors.ultrasonic.toFixed(1)}</div>
                        <div className="text-xs text-blue-600/70 dark:text-blue-400/70">cm</div>
                      </div>
                    </div>
                  )}
                  {robotStatus.sensors.temperature !== undefined && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 rounded-lg border border-orange-200/50 dark:border-orange-800/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500 shadow-orange-500/50 shadow-lg animate-pulse" />
                        <div>
                          <div className="text-xs font-semibold text-orange-900 dark:text-orange-100">Temperature</div>
                          <div className="text-xs text-orange-600/70 dark:text-orange-400/70">Environment</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-700 dark:text-orange-300">{robotStatus.sensors.temperature.toFixed(1)}</div>
                        <div className="text-xs text-orange-600/70 dark:text-orange-400/70">°C</div>
                      </div>
                    </div>
                  )}
                  {robotStatus.sensors.color && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 rounded-lg border border-purple-200/50 dark:border-purple-800/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full border-2 border-white shadow-lg animate-pulse"
                          style={{ 
                            backgroundColor: `rgb(${robotStatus.sensors.color.r}, ${robotStatus.sensors.color.g}, ${robotStatus.sensors.color.b})`
                          }}
                        />
                        <div>
                          <div className="text-xs font-semibold text-purple-900 dark:text-purple-100">Color RGB</div>
                          <div className="text-xs text-purple-600/70 dark:text-purple-400/70">Detection</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-purple-700 dark:text-purple-300 font-semibold">
                          {robotStatus.sensors.color.r},{robotStatus.sensors.color.g},{robotStatus.sensors.color.b}
                        </div>
                      </div>
                    </div>
                  )}
                  {robotStatus.sensors.touch && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 rounded-lg border border-pink-200/50 dark:border-pink-800/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-pink-500 shadow-pink-500/50 shadow-lg animate-pulse" />
                        <div>
                          <div className="text-xs font-semibold text-pink-900 dark:text-pink-100">Touch Sensors</div>
                          <div className="text-xs text-pink-600/70 dark:text-pink-400/70">Digital Input</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {robotStatus.sensors.touch.map((pressed, index) => (
                          <Badge 
                            key={index} 
                            variant={pressed ? "default" : "outline"}
                            className={`w-8 h-8 p-0 text-xs transition-all duration-300 ${
                              pressed 
                                ? 'bg-pink-500 text-white shadow-pink-500/50 shadow-lg animate-bounce' 
                                : 'border-pink-300 text-pink-600 hover:bg-pink-50'
                            }`}
                          >
                            {index + 1}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {Object.keys(robotStatus.sensors).length === 0 && (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">No sensor data available</div>
                      <div className="text-xs text-muted-foreground/70">Connect robot to see live readings</div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Enhanced System Information */}
              <Card className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/50 border-slate-200/50 dark:border-slate-800/50 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-slate-500/20 rounded">
                    <Cpu className="h-4 w-4 text-slate-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">System Information</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Firmware</span>
                    <Badge variant="outline" className="text-xs bg-slate-100 text-slate-700 border-slate-300 font-mono">
                      v1.10E
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Uptime</span>
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
                      {isClient && robotStatus.lastUpdate > 0 ? Math.floor((Date.now() - robotStatus.lastUpdate) / 1000) : 0}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Memory</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300" />
                      </div>
                      <span className="text-xs font-mono text-slate-700 dark:text-slate-300">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">CPU Load</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-1/8 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300" />
                      </div>
                      <span className="text-xs font-mono text-slate-700 dark:text-slate-300">12%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        
      </div>
      {/* Enhanced Status Bar with Modern Design */}
        <div className="border-t border-border/50 bg-gradient-to-r from-background/95 via-background to-background/95 backdrop-blur-xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                isRunning ? 'bg-green-500 shadow-green-500/50 shadow-lg animate-pulse' : 
                robotStatus.connected ? 'bg-blue-500 shadow-blue-500/50 shadow-lg animate-pulse' : 
                'bg-gray-400'
              }`} />
              <span className="font-semibold text-foreground">
                {isRunning ? 'Program Running' : robotStatus.connected ? 'Robot Connected' : 'Robot Disconnected'}
              </span>
              {isRunning && (
                <Badge variant="outline" className="text-xs animate-bounce bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                  <Activity className="h-3 w-3 mr-1" />
                  Executing
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-primary/10 rounded">
                  <MapPin className="h-3 w-3 text-primary" />
                </div>
                <span className="font-mono">
                  Position: ({robotStatus.position.x.toFixed(1)}, {robotStatus.position.y.toFixed(1)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-500/10 rounded">
                  <Code className="h-3 w-3 text-blue-600" />
                </div>
                <span>Lines: {generatedCode ? generatedCode.split('\n').length : 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-purple-500/10 rounded">
                  <Zap className="h-3 w-3 text-purple-600" />
                </div>
                <span>Commands: {robotCommands.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-orange-500/10 rounded">
                  <Clock className="h-3 w-3 text-orange-600" />
                </div>
                <span className="font-mono">
                  {robotStatus.lastUpdate ? new Date(robotStatus.lastUpdate).toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs bg-muted/50">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={activeTab === 'console' ? 'default' : 'outline'}
                onClick={() => setActiveTab('console')}
                className="text-xs h-8 px-3 transition-all duration-300 hover:shadow-md"
              >
                <Terminal className="h-3 w-3 mr-1.5" />
                Console
              </Button>
              <Button 
                size="sm" 
                variant={activeTab === 'python' ? 'default' : 'outline'}
                onClick={() => setActiveTab('python')}
                className="text-xs h-8 px-3 transition-all duration-300 hover:shadow-md"
              >
                <Code className="h-3 w-3 mr-1.5" />
                Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
