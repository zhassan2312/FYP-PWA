"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Cpu, RotateCcw, Send } from "lucide-react";

interface ProgramTerminalProps {
  terminalHistory: string[];
  terminalInput: string;
  onInputChange: (value: string) => void;
  onExecuteCommand: () => void;
  onClear: () => void;
}

export default function ProgramTerminal({ 
  terminalHistory, 
  terminalInput,
  onInputChange,
  onExecuteCommand,
  onClear 
}: ProgramTerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (terminalInput.trim()) {
        setCommandHistory(prev => [...prev, terminalInput]);
        setHistoryIndex(-1);
      }
      onExecuteCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        onInputChange(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          onInputChange('');
        } else {
          setHistoryIndex(newIndex);
          onInputChange(commandHistory[newIndex] || '');
        }
      }
    }
  };

  const commonCommands = [
    'python --version', 'pip --version', 'pip list', 'pip install numpy',
    'ls', 'pwd', 'cd', 'mkdir', 'cat', 'python -c "import sys; print(sys.version)"',
    'pip install -r requirements.txt', 'pip show numpy', 'clear'
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-[#1e1e1e] to-[#2d2d30] text-white">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-blue-400" />
          <span className="font-medium">Terminal</span>
          <div className="text-xs text-gray-400 ml-2">
            PWD: ~/FYP-PWA
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClear}
            className="h-7 px-2 text-xs text-[#cccccc] hover:bg-[#3e3e42] hover:text-white"
            title="Clear terminal"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Common Commands */}
      <div className="p-2 border-b bg-[#252526] text-white">
        <div className="text-xs text-gray-400 mb-2">Quick Commands:</div>
        <div className="flex flex-wrap gap-1">
          {commonCommands.map((cmd) => (
            <Button
              key={cmd}
              variant="ghost"
              size="sm"
              onClick={() => onInputChange(cmd)}
              className="h-6 px-2 text-xs text-gray-300 hover:bg-[#3e3e42] hover:text-white"
            >
              {cmd}
            </Button>
          ))}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col bg-black text-white font-mono text-sm overflow-auto">
        {/* History */}
        <div className="flex-1 p-4 space-y-1">
          {terminalHistory.map((line, index) => (
            <div key={index} className="flex">
              <span className="text-green-400 select-none">
                {line.startsWith('$') ? '' : '$ '}
              </span>
              <span className={line.startsWith('$') ? 'text-white' : 'text-gray-300'}>
                {line}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-green-400 select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              value={terminalInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none font-mono text-sm"
              placeholder="Enter command..."
              autoFocus
            />
            <Button
              onClick={onExecuteCommand}
              disabled={!terminalInput.trim()}
              size="sm"
              className="h-7 px-3 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Command hint */}
          {terminalInput && (
            <div className="mt-2 text-xs text-gray-500">
              Press Enter to execute • Use ↑↓ arrows for command history
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
