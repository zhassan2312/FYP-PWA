'use client';

import React from 'react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { 
  Layers,
  Bot,
  AlertTriangle,
  CheckCircle,
  Activity,
  Info,
  Zap,
  Eye,
  Cpu
} from 'lucide-react';
import { BlocklyWorkspace, ROBOT_TOOLBOX } from './blockly-workspace';

interface BlocklyWorkspaceTabProps {
  generatedCode: string;
  isRunning: boolean;
  executionError: string;
  onCodeChange: (code: string) => void;
  onProgramChange: (commands: any[]) => void;
  onExecutionError: (error: string) => void;
  onConsoleOutput: (message: string) => void;
}

export function BlocklyWorkspaceTab({
  generatedCode,
  isRunning,
  executionError,
  onCodeChange,
  onProgramChange,
  onExecutionError,
  onConsoleOutput
}: BlocklyWorkspaceTabProps) {
  const handleCodeChange = (code: string) => {
    onCodeChange(code);
  };

  const handleProgramChange = (commands: any[]) => {
    onProgramChange(commands);
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-muted/10 via-background to-muted/20 relative overflow-hidden">
      <div className="h-full w-full">
        <BlocklyWorkspace 
          toolboxConfig={ROBOT_TOOLBOX}
          onCodeChange={handleCodeChange}
          onProgramChange={handleProgramChange}
        />
      </div>
      
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
                  onConsoleOutput('🎯 Try dragging a "Move Forward" block from the Motor Control section!');
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
                  <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">Error</span>
                </h4>
                <p className="text-xs text-destructive/90 mb-4 leading-relaxed bg-destructive/10 p-2 rounded border">{executionError}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onExecutionError('')}
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
                  Executing blocks
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
  );
}
