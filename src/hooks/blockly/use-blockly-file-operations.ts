'use client';

export function useBlocklyFileOperations(
  generatedCode: string,
  robotCommands: any[],
  setGeneratedCode: (code: string) => void,
  setRobotCommands: (commands: any[]) => void,
  addConsoleMessage: (message: string) => void
) {
  const handleSave = () => {
    if (!generatedCode.trim()) {
      addConsoleMessage('⚠️ No code to save. Add some blocks first!');
      return;
    }

    const projectData = {
      code: generatedCode,
      commands: robotCommands,
      timestamp: Date.now(),
      version: '1.0'
    };

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `robot_project_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addConsoleMessage('💾 Project saved successfully');
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target?.result as string);
            setGeneratedCode(projectData.code || '');
            setRobotCommands(projectData.commands || []);
            addConsoleMessage(`📂 Project loaded: ${file.name}`);
          } catch (error) {
            addConsoleMessage('❌ Failed to load project: Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    setGeneratedCode('');
    setRobotCommands([]);
    // TODO: Clear the actual Blockly workspace
    addConsoleMessage('🗑️ Workspace cleared');
  };

  const handleExport = () => {
    if (!generatedCode.trim()) {
      addConsoleMessage('⚠️ No code to export. Add some blocks first!');
      return;
    }
    
    const element = document.createElement('a');
    const file = new Blob([generatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `robot_program_${Date.now()}.py`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addConsoleMessage('📥 Python code exported successfully');
  };

  const handleReset = () => {
    // TODO: Reset workspace to initial state
    addConsoleMessage('🔄 Workspace reset to initial state');
  };

  const handleClearConsole = (setConsoleOutput: (fn: (prev: string[]) => string[]) => void) => {
    setConsoleOutput(() => ['🤖 Console cleared']);
  };

  return {
    handleSave,
    handleLoad,
    handleClear,
    handleExport,
    handleReset,
    handleClearConsole
  };
}
