'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Code, Terminal, Cpu, Settings } from 'lucide-react';
import { mockPrograms, type Program } from '~/lib/mock-data';

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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(mockPrograms[0] || null);
  const [code, setCode] = useState(selectedProgram?.code || "");
  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [activeTab, setActiveTab] = useState("editor");
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["🚀 Programming environment ready..."]);
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

  const handleRun = () => {
    setIsRunning(true);
    const newOutput = `🚀 Starting ${language} program execution...`;
    setConsoleOutput(prev => [...prev, newOutput, "⚙️ Initializing runtime environment...", "▶️ Program running..."]);
    setTimeout(() => {
      setIsRunning(false);
      setConsoleOutput(prev => [...prev, "✅ Program completed successfully.", `⏱️ Execution time: ${Math.random() * 5 + 1}s`]);
    }, 3000);
  };

  const handleStop = () => {
    setIsRunning(false);
    setConsoleOutput(prev => [...prev, "🛑 Program execution stopped by user."]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setConsoleOutput(prev => [...prev, "💾 Saving program..."]);
    setTimeout(() => {
      setIsSaving(false);
      setConsoleOutput(prev => [...prev, "✅ Program saved successfully."]);
    }, 1000);
  };

  const handleReset = () => {
    setCode("");
    setConsoleOutput(["🚀 Programming environment ready...", "📝 Workspace reset"]);
    setErrors([]);
  };

  const handleTerminalCommand = () => {
    if (terminalInput.trim()) {
      const command = terminalInput.trim();
      setTerminalHistory(prev => [...prev, `$ ${command}`]);
      
      // Simulate command execution
      setTimeout(() => {
        let response = "";
        switch (command.toLowerCase()) {
          case 'help':
            response = "Available commands: ls, pwd, python, pip, clear, exit";
            break;
          case 'ls':
            response = "main.py  requirements.txt  README.md";
            break;
          case 'pwd':
            response = "/home/user/FYP-PWA";
            break;
          case 'python --version':
            response = "Python 3.9.7";
            break;
          case 'clear':
            setTerminalHistory(["$ Terminal ready"]);
            setTerminalInput("");
            return;
          default:
            response = `Command '${command}' not found. Type 'help' for available commands.`;
        }
        setTerminalHistory(prev => [...prev, response]);
      }, 500);
      
      setTerminalInput("");
    }
  };

  const handleProgramSelect = (programId: string) => {
    const program = mockPrograms.find((p: Program) => p.id === programId);
    if (program) {
      setSelectedProgram(program);
      setCode(program.code || "");
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
        selectedProgram={selectedProgram || undefined}
        programs={mockPrograms}
        onRun={handleRun}
        onStop={handleStop}
        onSave={handleSave}
        onReset={handleReset}
        onLanguageChange={setLanguage}
        onProgramSelect={handleProgramSelect}
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
                selectedProgram={selectedProgram || undefined}
                onCodeChange={setCode}
                onShowErrorsToggle={() => setShowErrors(!showErrors)}
              />
            </TabsContent>

            <TabsContent value="console" className="h-full mt-0 p-4">
              <ProgramConsole
                consoleOutput={consoleOutput}
                isRunning={isRunning}
                onClear={() => setConsoleOutput(["🚀 Programming environment ready..."])}
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
