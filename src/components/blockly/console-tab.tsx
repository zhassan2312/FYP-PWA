'use client';

import React from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { 
  Terminal,
  Trash2,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface ConsoleTabProps {
  consoleOutput: string[];
  isRunning: boolean;
  executionError: string;
  isClient: boolean;
  onClearConsole: () => void;
}

export function ConsoleTab({
  consoleOutput,
  isRunning,
  executionError,
  isClient,
  onClearConsole
}: ConsoleTabProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-border/50 p-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 flex-shrink-0">
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
            <Button
              size="sm"
              variant="outline"
              onClick={onClearConsole}
              className="text-xs h-8 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            >
              <Trash2 className="h-3 w-3 mr-1.5" />
              Clear Console
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-green-400 relative">
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
            <div className="text-center text-slate-500 max-w-md">
              <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-slate-600/50">
                <Terminal className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-400">Console Ready</h3>
              <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                Start building and running your robot program to see execution feedback here.
              </p>
              <div className="text-xs text-slate-600">
                All robot communication and system messages will appear in this console.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
