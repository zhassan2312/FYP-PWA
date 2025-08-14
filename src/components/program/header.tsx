"use client";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  Play, 
  Square, 
  Save, 
  Download, 
  Upload,
  RotateCcw,
  Code,
  FileText,
  Zap
} from "lucide-react";

interface ProgramHeaderProps {
  isRunning: boolean;
  isSaving: boolean;
  language: "python" | "javascript";
  onRun: () => void;
  onStop: () => void;
  onSave: () => void;
  onReset: () => void;
  onLanguageChange: (language: "python" | "javascript") => void;
}

export default function ProgramHeader({
  isRunning,
  isSaving,
  language,
  onRun,
  onStop,
  onSave,
  onReset,
  onLanguageChange
}: ProgramHeaderProps) {
  
  const exportProgram = () => {
    // This would export the current program
    console.log('Exporting program...');
  };

  const importProgram = () => {
    // This would import a program file
    console.log('Importing program...');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-white to-gray-50 shadow-sm">
      {/* Left Section - Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Code className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Program Editor</h1>
          <Badge variant="outline" className="text-xs">
            Controller Programming
          </Badge>
        </div>
      </div>

      {/* Right Section - Actions and Status */}
      <div className="flex items-center gap-3">
        {/* Status Badge */}
        <Badge 
          variant={isRunning ? "default" : "secondary"} 
          className={`${isRunning ? 'bg-green-500 hover:bg-green-600' : ''} shadow-sm`}
        >
          {isRunning ? (
            <>
              <Zap className="h-3 w-3 mr-1 animate-pulse" />
              Running
            </>
          ) : (
            'Ready'
          )}
        </Badge>
        
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Language:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLanguageChange(language === "python" ? "javascript" : "python")}
            className="gap-2 shadow-sm"
          >
            {language === "python" ? "🐍" : "📜"}
            {language === "python" ? "Python" : "JavaScript"}
          </Button>
        </div>

        {/* File Operations */}
        <div className="flex items-center gap-1 border-l pl-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="gap-2 shadow-sm"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={importProgram}
            className="gap-2 shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportProgram}
            className="gap-2 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2 shadow-sm hover:bg-red-50 hover:border-red-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Execution Controls */}
        <div className="flex items-center gap-1 border-l pl-3">
          <Button
            onClick={onRun}
            disabled={isRunning}
            size="sm"
            className="gap-2 bg-green-600 hover:bg-green-700 shadow-md"
          >
            <Play className="h-4 w-4" />
            Run Program
          </Button>
          
          <Button
            onClick={onStop}
            disabled={!isRunning}
            variant="outline"
            size="sm"
            className="gap-2 shadow-sm hover:bg-red-50 hover:border-red-200"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
        </div>
      </div>
    </div>
  );
}
