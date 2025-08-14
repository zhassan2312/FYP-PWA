"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  Settings,
  Cpu,
  Wifi,
  Bluetooth,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
  Eye,
  EyeOff
} from "lucide-react";
import { mockPrograms } from "~/lib/mock-data";
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center text-white">
      <div className="flex items-center gap-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        Loading VS Code Editor...
      </div>
    </div>
  )
});

// Error types for Monaco Editor markers
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
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [activeTab, setActiveTab] = useState("editor");
  const [selectedProgram, setSelectedProgram] = useState(mockPrograms[0]);
  const [code, setCode] = useState(selectedProgram?.code || `# Welcome to the VS Code-like Python Editor
import time
from robot_controller import RobotController

def main():
    # Initialize the robot controller
    controller = RobotController()
    print("Controller initialized successfully!")
    
    # Main control loop
    while True:
        try:
            # Read sensor data
            sensor_value = controller.read_sensor('A0')
            print(f"Sensor reading: {sensor_value}")
            
            # Control motors based on sensor input
            if sensor_value > 500:
                controller.move_forward(speed=80)
            else:
                controller.stop()
                
            time.sleep(0.1)
            
        except KeyboardInterrupt:
            print("Program stopped by user")
            controller.stop()
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
`);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["Programming environment ready..."]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>(["$ Terminal ready"]);
  const [terminalInput, setTerminalInput] = useState("");
  const [errors, setErrors] = useState<CodeError[]>([]);
  const [showErrors, setShowErrors] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light' | 'hc-black'>('vs-dark');
  const monacoRef = useRef<any>(null);

  // Monaco Editor configuration
  const handleEditorDidMount = (editor: any, monaco: any) => {
    monacoRef.current = { editor, monaco };
    
    // Configure Monaco for better Python experience
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    
    // Add custom error markers
    updateErrorMarkers();
  };

  const updateErrorMarkers = () => {
    if (!monacoRef.current) return;
    
    const { editor, monaco } = monacoRef.current;
    const model = editor.getModel();
    
    if (model) {
      // Clear existing markers
      monaco.editor.setModelMarkers(model, 'python-linter', []);
      
      // Add new markers for errors
      const markers = errors.map(error => ({
        startLineNumber: error.line,
        startColumn: error.column,
        endLineNumber: error.endLine || error.line,
        endColumn: error.endColumn || error.column + 10,
        message: error.message,
        severity: error.severity === 'error' ? monaco.MarkerSeverity.Error :
                 error.severity === 'warning' ? monaco.MarkerSeverity.Warning :
                 monaco.MarkerSeverity.Info,
        source: error.type
      }));
      
      monaco.editor.setModelMarkers(model, 'python-linter', markers);
    }
  };

  // Check for errors when code changes
  useEffect(() => {
    if (code) {
      const foundErrors = checkForErrors(code);
      setErrors(foundErrors);
    }
  }, [code]);

  // Update markers when errors change
  useEffect(() => {
    updateErrorMarkers();
  }, [errors]);

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
      
      if (line.includes('robot') && !line.includes('import') && !line.includes('=')) {
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

  const handleRun = () => {
    setIsRunning(true);
    const newOutput = `Starting ${language} program execution...`;
    setConsoleOutput(prev => [...prev, newOutput, "Program running..."]);
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(prev => [...prev, "Program completed successfully."]);
    }, 2000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [...prev, "Program execution stopped."]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setConsoleOutput(prev => [...prev, "Saving program..."]);
    setTimeout(() => {
      setIsSaving(false);
      setConsoleOutput(prev => [...prev, "Program saved successfully."]);
    }, 1000);
  };

  const handleTerminalCommand = () => {
    if (terminalInput.trim()) {
      setTerminalHistory(prev => [...prev, `$ ${terminalInput}`, "Command executed"]);
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Program Controller</h1>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">Text Programming</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "python" ? "javascript" : "python")}
            >
              {language === "python" ? "Python" : "JavaScript"}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <div className="flex items-center gap-1">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              size="sm"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isRunning}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* File selector for editor tab */}
          {activeTab === "editor" && (
            <div className="flex items-center gap-2">
              <select 
                className="p-2 border rounded-md"
                value={selectedProgram?.id || ""}
                onChange={(e) => {
                  const program = mockPrograms.find(p => p.id === e.target.value);
                  if (program) {
                    setSelectedProgram(program);
                    setCode(program.code || "");
                  }
                }}
              >
                {mockPrograms.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Load
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full flex flex-col">
            {/* Code Editor Tab */}
            <TabsContent value="editor" className="flex-1 mt-0">
              <div className="h-full flex flex-col">
                <div className="p-2 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {selectedProgram?.name || "New Program"} ({language})
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  {/* VS Code-like Monaco Editor Container */}
                  <div className="h-full border rounded-md overflow-hidden">
                    {/* Editor Header with Tabs and Actions */}
                    <div className="flex items-center justify-between p-2 bg-[#2d2d30] border-b border-[#3e3e42]">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 bg-[#1e1e1e] border border-[#3e3e42] rounded text-xs text-white">
                          <Code className="h-3 w-3" />
                          {selectedProgram?.name || "main.py"}
                        </div>
                        {errors.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {errors.filter(e => e.severity === 'error').length} errors
                          </Badge>
                        )}
                        {errors.filter(e => e.severity === 'warning').length > 0 && (
                          <Badge variant="secondary" className="text-xs bg-yellow-600">
                            {errors.filter(e => e.severity === 'warning').length} warnings
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setShowErrors(!showErrors)}
                          className="h-6 px-2 text-xs text-[#cccccc] hover:bg-[#3e3e42]"
                        >
                          {showErrors ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>

                    {/* Error Panel */}
                    {showErrors && errors.length > 0 && (
                      <div className="max-h-32 overflow-y-auto bg-[#252526] border-b border-[#3e3e42]">
                        <div className="p-2">
                          <div className="text-xs text-[#cccccc] mb-2 font-semibold">PROBLEMS</div>
                          {errors.map((error, index) => (
                            <div key={index} className="flex items-start gap-2 py-1 text-xs hover:bg-[#2a2d2e] rounded px-2 cursor-pointer">
                              {error.severity === 'error' && <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />}
                              {error.severity === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />}
                              {error.severity === 'info' && <Info className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />}
                              <div className="flex-1">
                                <div className="text-[#cccccc]">{error.message}</div>
                                <div className="text-[#888888]">
                                  {selectedProgram?.name || "main.py"} ({error.line}, {error.column}) - {error.type}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Monaco Editor */}
                    <div className="h-full">
                      <MonacoEditor
                        height="100%"
                        language={language}
                        theme={editorTheme}
                        value={code}
                        onChange={(value) => setCode(value || '')}
                        onMount={handleEditorDidMount}
                        options={{
                          fontSize: fontSize,
                          wordWrap: wordWrap ? 'on' : 'off',
                          minimap: { enabled: true },
                          lineNumbers: 'on',
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          tabSize: 4,
                          insertSpaces: true,
                          renderWhitespace: 'selection',
                          bracketPairColorization: { enabled: true },
                          contextmenu: true,
                          cursorBlinking: 'blink',
                          cursorSmoothCaretAnimation: 'on',
                          folding: true,
                          foldingHighlight: true,
                          guides: {
                            bracketPairs: true,
                            indentation: true,
                            highlightActiveIndentation: true
                          },
                          matchBrackets: 'always',
                          renderLineHighlight: 'all',
                          selectOnLineNumbers: true,
                          smoothScrolling: true,
                          suggestOnTriggerCharacters: true,
                          quickSuggestions: true,
                          parameterHints: { enabled: true },
                          autoIndent: 'advanced',
                          formatOnPaste: true,
                          formatOnType: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Console Tab */}
            <TabsContent value="console" className="flex-1 mt-0">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="font-medium">Console Output</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setConsoleOutput(["Programming environment ready..."])}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                <div className="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
                  {consoleOutput.map((line, index) => (
                    <div key={index}>$ {line}</div>
                  ))}
                  {isRunning && (
                    <div className="animate-pulse">$ Running...</div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Terminal Tab */}
            <TabsContent value="terminal" className="flex-1 mt-0">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="font-medium">Terminal</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setTerminalHistory(["$ Terminal ready"])}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                <div className="flex-1 flex flex-col bg-black text-white">
                  <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                    {terminalHistory.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleTerminalCommand()}
                        className="flex-1 bg-transparent border-none outline-none text-white font-mono"
                        placeholder="Enter command..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="flex-1 mt-0">
              <div className="h-full p-4 space-y-4 overflow-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Editor Settings
                    </CardTitle>
                    <CardDescription>
                      Customize your coding environment like VS Code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Font Size</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="range"
                            min="10"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm w-8">{fontSize}px</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Word Wrap</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={wordWrap}
                            onChange={(e) => setWordWrap(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Enable word wrapping</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Show Errors</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={showErrors}
                            onChange={(e) => setShowErrors(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Display error panel</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Editor Theme</label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={editorTheme}
                          onChange={(e) => setEditorTheme(e.target.value as 'vs-dark' | 'light' | 'hc-black')}
                        >
                          <option value="vs-dark">Dark (VS Code Dark)</option>
                          <option value="light">Light</option>
                          <option value="hc-black">High Contrast</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Language</label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as "python" | "javascript")}
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Run Program:</span>
                          <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + F5</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span>Save File:</span>
                          <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + S</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span>Toggle Console:</span>
                          <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + `</kbd>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Programming Environment
                    </CardTitle>
                    <CardDescription>
                      Configure programming environment and linting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Auto Save</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="off">Off</option>
                          <option value="afterDelay">After Delay</option>
                          <option value="onFocusChange">On Focus Change</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Linting</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="enabled">Enabled</option>
                          <option value="disabled">Disabled</option>
                          <option value="warnings-only">Warnings Only</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Indentation</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="4">4 spaces</option>
                          <option value="2">2 spaces</option>
                          <option value="tab">Tab</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Line Endings</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="auto">Auto</option>
                          <option value="crlf">CRLF (Windows)</option>
                          <option value="lf">LF (Unix)</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5" />
                      Controller Connection
                    </CardTitle>
                    <CardDescription>
                      Configure connection to controller board
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Connection Type</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="serial">Serial/USB</option>
                          <option value="wifi">WiFi</option>
                          <option value="bluetooth">Bluetooth</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Baud Rate</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="9600">9600</option>
                          <option value="115200">115200</option>
                          <option value="230400">230400</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button className="gap-2">
                        <Wifi className="h-4 w-4" />
                        Connect
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Bluetooth className="h-4 w-4" />
                        Scan Devices
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Code Execution Settings</CardTitle>
                    <CardDescription>
                      Configure how programs are executed on the controller
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Execution Mode</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="realtime">Real-time</option>
                          <option value="batch">Batch</option>
                          <option value="debug">Debug Mode</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Auto-save Interval (seconds)</label>
                        <input 
                          type="number" 
                          defaultValue="30" 
                          className="w-full p-2 border rounded-md"
                          min="10"
                          max="300"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

