'use client';

import React from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { 
  Activity,
  Terminal,
  Code,
  MapPin,
  Zap,
  Clock,
  Bot
} from 'lucide-react';
import { type RobotStatus } from '~/lib/robot-service';

interface StatusBarProps {
  isRunning: boolean;
  robotStatus: RobotStatus;
  generatedCode: string;
  robotCommands: any[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggleRobotPanel?: () => void;
  showRobotPanel?: boolean;
}

export function StatusBar({
  isRunning,
  robotStatus,
  generatedCode,
  robotCommands,
  activeTab,
  onTabChange,
  onToggleRobotPanel,
  showRobotPanel
}: StatusBarProps) {
  return (
    <div className="border-t border-border/50 bg-gradient-to-r from-background/95 via-background to-background/95 backdrop-blur-xl p-2 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 justify-between shadow-lg">
      <div className="flex items-center gap-3 sm:gap-8 text-xs sm:text-sm w-full sm:w-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${
            isRunning ? 'bg-green-500 shadow-green-500/50 shadow-lg animate-pulse' : 
            robotStatus.connected ? 'bg-blue-500 shadow-blue-500/50 shadow-lg animate-pulse' : 
            'bg-gray-400'
          }`} />
          <span className="font-semibold text-foreground text-xs sm:text-sm">
            {isRunning ? 'Running' : robotStatus.connected ? 'Connected' : 'Disconnected'}
          </span>
          {isRunning && (
            <Badge variant="outline" className="text-xs animate-bounce bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-xs text-muted-foreground overflow-x-auto">
          {/* Position - Hidden on very small screens */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="p-1 bg-primary/10 rounded">
              <MapPin className="h-3 w-3 text-primary" />
            </div>
            <span className="font-mono whitespace-nowrap">
              ({robotStatus.position.x.toFixed(1)}, {robotStatus.position.y.toFixed(1)})
            </span>
          </div>
          
          {/* Code lines - Compact on small screens */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="p-1 bg-blue-500/10 rounded">
              <Code className="h-3 w-3 text-blue-600" />
            </div>
            <span className="whitespace-nowrap">Lines: {generatedCode ? generatedCode.split('\n').length : 0}</span>
          </div>
          
          {/* Commands - Always visible */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="p-1 bg-purple-500/10 rounded">
              <Zap className="h-3 w-3 text-purple-600" />
            </div>
            <span className="whitespace-nowrap">Cmds: {robotCommands.length}</span>
          </div>
          
          {/* Last update - Hidden on small screens */}
          <div className="hidden lg:flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="p-1 bg-orange-500/10 rounded">
              <Clock className="h-3 w-3 text-orange-600" />
            </div>
            <span className="font-mono whitespace-nowrap">
              {robotStatus.lastUpdate ? new Date(robotStatus.lastUpdate).toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Robot Panel Toggle - Only on small screens */}
        {onToggleRobotPanel && (
          <Button 
            size="sm" 
            variant={showRobotPanel ? 'default' : 'outline'}
            onClick={onToggleRobotPanel}
            className="md:hidden text-xs h-7 sm:h-8 px-2 sm:px-3 transition-all duration-300 hover:shadow-md"
          >
            <Bot className="h-3 w-3 mr-1" />
            Robot
          </Button>
        )}

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs bg-muted/50">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Badge>
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          <Button 
            size="sm" 
            variant={activeTab === 'console' ? 'default' : 'outline'}
            onClick={() => onTabChange('console')}
            className="text-xs h-7 sm:h-8 px-2 sm:px-3 transition-all duration-300 hover:shadow-md"
          >
            <Terminal className="h-3 w-3 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Console</span>
          </Button>
          <Button 
            size="sm" 
            variant={activeTab === 'python' ? 'default' : 'outline'}
            onClick={() => onTabChange('python')}
            className="text-xs h-7 sm:h-8 px-2 sm:px-3 transition-all duration-300 hover:shadow-md"
          >
            <Code className="h-3 w-3 mr-1 sm:mr-1.5" />
            <span className="hidden sm:inline">Code</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
