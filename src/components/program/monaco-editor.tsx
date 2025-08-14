"use client";

import { useRef, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Code, Eye, EyeOff, AlertCircle, AlertTriangle, Info } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center text-white">
      <div className="flex items-center gap-2">
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        Loading VS Code Editor...
      </div>
    </div>
  )
});

// Error types for Monaco Editor markers
export interface CodeError {
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  type: string;
}

interface MonacoCodeEditorProps {
  code: string;
  language: "python" | "javascript";
  theme: 'vs-dark' | 'light' | 'hc-black';
  fontSize: number;
  wordWrap: boolean;
  errors: CodeError[];
  showErrors: boolean;
  selectedProgram?: { name?: string };
  onCodeChange: (code: string) => void;
  onShowErrorsToggle: () => void;
}

export default function MonacoCodeEditor({
  code,
  language,
  theme,
  fontSize,
  wordWrap,
  errors,
  showErrors,
  selectedProgram,
  onCodeChange,
  onShowErrorsToggle
}: MonacoCodeEditorProps) {
  const monacoRef = useRef<any>(null);

  // Monaco Editor configuration
  const handleEditorDidMount = (editor: any, monaco: any) => {
    monacoRef.current = { editor, monaco };
    
    // Configure Monaco for better experience
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    
    // Add custom error markers
    updateErrorMarkers();
  };

  const updateErrorMarkers = () => {
    if (!monacoRef.current) return;
    
    const { editor, monaco } = monacoRef.current;
    const model = editor.getModel();
    
    if (model) {
      // Clear existing markers
      monaco.editor.setModelMarkers(model, 'python-linter', []);
      
      // Add new markers for errors
      const markers = errors.map(error => ({
        startLineNumber: error.line,
        startColumn: error.column,
        endLineNumber: error.endLine || error.line,
        endColumn: error.endColumn || error.column + 10,
        message: error.message,
        severity: error.severity === 'error' ? monaco.MarkerSeverity.Error :
                 error.severity === 'warning' ? monaco.MarkerSeverity.Warning :
                 monaco.MarkerSeverity.Info,
        source: error.type
      }));
      
      monaco.editor.setModelMarkers(model, 'python-linter', markers);
    }
  };

  // Update markers when errors change
  useEffect(() => {
    updateErrorMarkers();
  }, [errors]);

  return (
    <div className="h-full border rounded-lg overflow-hidden shadow-lg">
      {/* Editor Header with Tabs and Actions */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#2d2d30] to-[#3e3e42] border-b border-[#3e3e42]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] border border-[#3e3e42] rounded-md text-xs text-white shadow-sm">
            <Code className="h-3 w-3 text-blue-400" />
            <span className="font-medium">{selectedProgram?.name || "main.py"}</span>
          </div>
          
          {errors.length > 0 && (
            <div className="flex items-center gap-2">
              {errors.filter(e => e.severity === 'error').length > 0 && (
                <Badge variant="destructive" className="text-xs shadow-sm">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.filter(e => e.severity === 'error').length} errors
                </Badge>
              )}
              {errors.filter(e => e.severity === 'warning').length > 0 && (
                <Badge className="text-xs bg-yellow-600 hover:bg-yellow-700 shadow-sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {errors.filter(e => e.severity === 'warning').length} warnings
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onShowErrorsToggle}
            className="h-7 px-3 text-xs text-[#cccccc] hover:bg-[#3e3e42] hover:text-white transition-colors"
          >
            {showErrors ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {showErrors ? 'Hide' : 'Show'} Problems
          </Button>
        </div>
      </div>

      {/* Error Panel */}
      {showErrors && errors.length > 0 && (
        <div className="max-h-36 overflow-y-auto bg-[#252526] border-b border-[#3e3e42]">
          <div className="p-3">
            <div className="text-xs text-[#cccccc] mb-3 font-semibold tracking-wide">
              PROBLEMS ({errors.length})
            </div>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 py-2 px-3 text-xs hover:bg-[#2a2d2e] rounded-md cursor-pointer transition-colors group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {error.severity === 'error' && <AlertCircle className="h-3 w-3 text-red-400" />}
                    {error.severity === 'warning' && <AlertTriangle className="h-3 w-3 text-yellow-400" />}
                    {error.severity === 'info' && <Info className="h-3 w-3 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#cccccc] group-hover:text-white transition-colors">
                      {error.message}
                    </div>
                    <div className="text-[#888888] mt-1 text-xs">
                      {selectedProgram?.name || "main.py"} • Line {error.line}, Column {error.column} • {error.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="h-full min-h-[400px]">
        <MonacoEditor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: fontSize,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: true },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            contextmenu: true,
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: 'on',
            folding: true,
            foldingHighlight: true,
            guides: {
              bracketPairs: true,
              indentation: true,
              highlightActiveIndentation: true
            },
            matchBrackets: 'always',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            smoothScrolling: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            autoIndent: 'advanced',
            formatOnPaste: true,
            formatOnType: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              showVariables: true,
            },
          }}
        />
      </div>
    </div>
  );
}
