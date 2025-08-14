"use client";

import { useRef, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Terminal, RotateCcw, Copy, Download } from "lucide-react";

interface ProgramConsoleProps {
  consoleOutput: string[];
  isRunning: boolean;
  onClear: () => void;
}

export default function ProgramConsole({ 
  consoleOutput, 
  isRunning, 
  onClear 
}: ProgramConsoleProps) {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  const copyToClipboard = () => {
    const text = consoleOutput.join('\n');
    navigator.clipboard.writeText(text);
  };

  const exportLog = () => {
    const text = consoleOutput.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'console-output.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-[#1e1e1e] to-[#2d2d30] text-white">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-green-400" />
          <span className="font-medium">Console Output</span>
          {isRunning && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Running</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={copyToClipboard}
            className="h-7 px-2 text-xs text-[#cccccc] hover:bg-[#3e3e42] hover:text-white"
            title="Copy output"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={exportLog}
            className="h-7 px-2 text-xs text-[#cccccc] hover:bg-[#3e3e42] hover:text-white"
            title="Export log"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClear}
            className="h-7 px-2 text-xs text-[#cccccc] hover:bg-[#3e3e42] hover:text-white"
            title="Clear console"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
        <div className="space-y-1">
          {consoleOutput.map((line, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-gray-500 select-none min-w-[3ch]">
                {String(index + 1).padStart(3, ' ')}
              </span>
              <span className="flex-1 whitespace-pre-wrap">{line}</span>
            </div>
          ))}
          
          {isRunning && (
            <div className="flex items-center gap-2 py-2">
              <span className="text-gray-500 select-none min-w-[3ch]">
                {String(consoleOutput.length + 1).padStart(3, ' ')}
              </span>
              <div className="flex items-center gap-2 text-yellow-400">
                <div className="animate-pulse">▶</div>
                <span>Program executing...</span>
              </div>
            </div>
          )}
          
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
}
