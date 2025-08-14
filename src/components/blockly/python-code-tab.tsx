'use client';

import React from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { 
  Code,
  Download,
  CheckCircle,
  FileCode
} from 'lucide-react';

interface PythonCodeTabProps {
  generatedCode: string;
  robotCommands: any[];
  onExport: () => void;
}

export function PythonCodeTab({ 
  generatedCode, 
  robotCommands,
  onExport 
}: PythonCodeTabProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b border-border/50 p-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 flex-shrink-0">
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
                onClick={onExport}
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
      <div className="flex-1 min-h-0 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative">
        {generatedCode.trim() ? (
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="outline" className="bg-slate-800/80 text-slate-200 border-slate-600">
                Python 3.x
              </Badge>
            </div>
            <pre className="p-6 text-sm leading-relaxed font-mono overflow-x-auto">
              <code className="text-green-400">{generatedCode}</code>
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400 max-w-md">
              <div className="mb-6">
                <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-slate-600/50">
                  <FileCode className="h-10 w-10 text-slate-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-300">No Code Generated Yet</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Start building your robot program with blocks in the Blockly workspace. 
                Python code will appear here automatically as you add blocks.
              </p>
              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Drag blocks from the toolbox</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>Connect blocks to create sequences</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>Watch your Python code generate</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
