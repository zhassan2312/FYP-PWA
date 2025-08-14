'use client';

import React from 'react';
import { Button } from '~/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { 
  Code, 
  Terminal, 
  Settings, 
  Layers,
  Maximize,
  Minimize,
  Save,
  FolderOpen,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Play,
  Square
} from 'lucide-react';

interface BlocklyHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isRunning: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRun: () => void;
  onStop: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onExport: () => void;
  onReset: () => void;
}

export function BlocklyHeader({
  activeTab,
  onTabChange,
  isRunning,
  isFullscreen,
  onToggleFullscreen,
  onRun,
  onStop,
  onSave,
  onLoad,
  onClear,
  onExport,
  onReset
}: BlocklyHeaderProps) {
  return (
    <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl shadow-sm">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 gap-2 sm:gap-4">
          <TabsList className="grid w-auto grid-cols-4 h-9 sm:h-11 bg-muted/50 backdrop-blur border border-border/50 shadow-sm flex-shrink-0">
            <TabsTrigger value="blockly" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Blockly</span>
            </TabsTrigger>
            <TabsTrigger value="python" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
              <Code className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Python</span>
            </TabsTrigger>
            <TabsTrigger value="console" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
              <Terminal className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Console</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-3 min-w-0">
            {/* File Operations - Hidden on very small screens */}
            <div className="hidden md:flex items-center gap-1 border-r border-border/50 pr-2 mr-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onLoad}
                className="text-xs h-8 sm:h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105 px-2 sm:px-3"
              >
                <FolderOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span className="hidden lg:inline">Load</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onSave}
                className="text-xs h-8 sm:h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105 px-2 sm:px-3"
              >
                <Save className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span className="hidden lg:inline">Save</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onExport}
                className="text-xs h-8 sm:h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105 px-2 sm:px-3"
              >
                <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </div>

            {/* Workspace Operations - Compact on small screens */}
            <div className="hidden sm:flex items-center gap-1 border-r border-border/50 pr-2 mr-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onClear}
                className="text-xs h-8 sm:h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105 px-2 sm:px-3"
              >
                <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span className="hidden lg:inline">Clear</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onReset}
                className="text-xs h-8 sm:h-9 hover:bg-muted/50 transition-all duration-200 hover:scale-105 px-2 sm:px-3"
              >
                <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                <span className="hidden lg:inline">Reset</span>
              </Button>
            </div>

            {/* Execution Controls - Always visible */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                size="sm"
                variant={isRunning ? "destructive" : "default"}
                onClick={isRunning ? onStop : onRun}
                disabled={false}
                className="min-w-16 sm:min-w-24 h-8 sm:h-9 font-medium shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 text-xs sm:text-sm px-2 sm:px-3"
              >
                {isRunning ? (
                  <>
                    <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Run
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleFullscreen}
                className="h-8 sm:h-9 px-2 sm:px-3 hover:bg-muted/50 transition-all duration-200 hover:scale-105"
              >
                {isFullscreen ? <Minimize className="h-3 w-3 sm:h-4 sm:w-4" /> : <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
