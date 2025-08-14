'use client';

import React from 'react';
import { Tabs, TabsContent } from '~/components/ui/tabs';
import { TooltipProvider } from '~/components/ui/tooltip';
import {
  BlocklyHeader,
  BlocklyWorkspaceTab,
  PythonCodeTab,
  ConsoleTab,
  SettingsTab,
  RobotStatusPanel,
  StatusBar,
  useBlocklyState
} from '~/components/blockly';
import { useBlocklyFileOperations } from '~/components/blockly/use-blockly-file-operations';

export default function BlocklyPage() {
  const {
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
  } = useBlocklyState();

  const {
    handleSave,
    handleLoad,
    handleClear,
    handleExport,
    handleReset,
    handleClearConsole
  } = useBlocklyFileOperations(
    generatedCode,
    robotCommands,
    setGeneratedCode,
    setRobotCommands,
    addConsoleMessage
  );

  // Mobile robot panel state
  const [showMobileRobotPanel, setShowMobileRobotPanel] = React.useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleMobileRobotPanel = () => {
    setShowMobileRobotPanel(!showMobileRobotPanel);
  };

  return (
    <TooltipProvider>
      <div className="max-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Panel - Workspace */}
          <div className="flex-1 flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm min-w-0 overflow-hidden">
            <BlocklyHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isRunning={isRunning}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onRun={handleRunProgram}
              onStop={handleStopProgram}
              onSave={handleSave}
              onLoad={handleLoad}
              onClear={handleClear}
              onExport={handleExport}
              onReset={handleReset}
            />

            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsContent value="blockly" className="h-full m-0 p-0 overflow-hidden">
                  <BlocklyWorkspaceTab
                    generatedCode={generatedCode}
                    isRunning={isRunning}
                    executionError={executionError}
                    onCodeChange={handleCodeChange}
                    onProgramChange={handleProgramChange}
                    onExecutionError={setExecutionError}
                    onConsoleOutput={addConsoleMessage}
                  />
                </TabsContent>

                <TabsContent value="python" className="h-full m-0 p-0 overflow-hidden">
                  <PythonCodeTab
                    generatedCode={generatedCode}
                    robotCommands={robotCommands}
                    onExport={handleExport}
                  />
                </TabsContent>

                <TabsContent value="console" className="h-full m-0 p-0 overflow-hidden">
                  <ConsoleTab
                    consoleOutput={consoleOutput}
                    isRunning={isRunning}
                    executionError={executionError}
                    isClient={isClient}
                    onClearConsole={() => handleClearConsole(setConsoleOutput)}
                  />
                </TabsContent>

                <TabsContent value="settings" className="h-full m-0 p-0 overflow-hidden">
                  <SettingsTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Robot Status (responsive visibility) */}
          {!isFullscreen && (
            <div className="hidden md:block">
              <RobotStatusPanel
                robotStatus={robotStatus}
                isClient={isClient}
              />
            </div>
          )}
        </div>

        {/* Status Bar */}
        <StatusBar
          isRunning={isRunning}
          robotStatus={robotStatus}
          generatedCode={generatedCode}
          robotCommands={robotCommands}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onToggleRobotPanel={toggleMobileRobotPanel}
          showRobotPanel={showMobileRobotPanel}
        />

        {/* Mobile Robot Panel Overlay */}
        {showMobileRobotPanel && (
          <div className="md:hidden fixed inset-0 bg-black/50 z-50 overflow-y-auto" onClick={toggleMobileRobotPanel}>
            <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] " onClick={(e) => e.stopPropagation()}>
              <RobotStatusPanel
                robotStatus={robotStatus}
                isClient={isClient}
              />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
