'use client';

import { useState, useEffect, useRef } from 'react';
import { robotService, type RobotStatus, type RobotCommand } from '~/lib/robot-service';

export function useBlocklyState() {
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

  const handleCodeChange = (code: string) => {
    setGeneratedCode(code);
    
    // Clear error when code changes
    if (executionError) {
      setExecutionError('');
    }
  };

  const handleProgramChange = (commands: RobotCommand[]) => {
    setRobotCommands(commands);
    setConsoleOutput(prev => [...prev, `🔄 Program updated: ${commands.length} commands ready`]);
  };

  const handleRunProgram = async () => {
    if (!generatedCode.trim()) {
      setConsoleOutput(prev => [...prev, `⚠️ No program to run. Build some blocks first!`]);
      return;
    }

    setIsRunning(true);
    setExecutionError('');
    setConsoleOutput(prev => [...prev, `🚀 Starting program execution...`, `📝 Running ${robotCommands.length} commands`]);

    try {
      // Execute the program using robot service
      await robotService.executeProgram(robotCommands);
      setConsoleOutput(prev => [...prev, `✅ Program completed successfully`]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setExecutionError(errorMessage);
      setConsoleOutput(prev => [...prev, `❌ Execution failed: ${errorMessage}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopProgram = () => {
    setIsRunning(false);
    robotService.stopProgram();
    setConsoleOutput(prev => [...prev, `⏹️ Program execution stopped`]);
  };

  const addConsoleMessage = (message: string) => {
    setConsoleOutput(prev => [...prev, message]);
  };

  return {
    // State
    activeTab,
    generatedCode,
    robotCommands,
    isRunning,
    isFullscreen,
    isClient,
    robotStatus,
    executionError,
    consoleOutput,
    workspaceRef,

    // Actions
    setActiveTab,
    setGeneratedCode,
    setRobotCommands,
    setIsRunning,
    setIsFullscreen,
    setExecutionError,
    setConsoleOutput,
    handleCodeChange,
    handleProgramChange,
    handleRunProgram,
    handleStopProgram,
    addConsoleMessage
  };
}
