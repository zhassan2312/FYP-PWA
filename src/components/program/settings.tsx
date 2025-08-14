"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { 
  Settings, 
  Code, 
  Cpu, 
  Wifi, 
  Bluetooth, 
  Download,
  Upload,
  RotateCcw,
  Monitor,
  Palette
} from "lucide-react";

interface ProgramSettingsProps {
  language: "python" | "javascript";
  fontSize: number;
  wordWrap: boolean;
  showErrors: boolean;
  editorTheme: 'vs-dark' | 'light' | 'hc-black';
  onLanguageChange: (language: "python" | "javascript") => void;
  onFontSizeChange: (size: number) => void;
  onWordWrapChange: (wrap: boolean) => void;
  onShowErrorsChange: (show: boolean) => void;
  onThemeChange: (theme: 'vs-dark' | 'light' | 'hc-black') => void;
}

export default function ProgramSettings({
  language,
  fontSize,
  wordWrap,
  showErrors,
  editorTheme,
  onLanguageChange,
  onFontSizeChange,
  onWordWrapChange,
  onShowErrorsChange,
  onThemeChange
}: ProgramSettingsProps) {
  
  const resetSettings = () => {
    onLanguageChange("python");
    onFontSizeChange(14);
    onWordWrapChange(true);
    onShowErrorsChange(true);
    onThemeChange('vs-dark');
  };

  const exportSettings = () => {
    const settings = {
      language,
      fontSize,
      wordWrap,
      showErrors,
      editorTheme
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'program-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            if (settings.language) onLanguageChange(settings.language);
            if (settings.fontSize) onFontSizeChange(settings.fontSize);
            if (settings.wordWrap !== undefined) onWordWrapChange(settings.wordWrap);
            if (settings.showErrors !== undefined) onShowErrorsChange(settings.showErrors);
            if (settings.editorTheme) onThemeChange(settings.editorTheme);
          } catch (error) {
            console.error('Error parsing settings file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-full p-4 space-y-6 overflow-auto">
      {/* Editor Settings */}
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-500" />
            Editor Settings
          </CardTitle>
          <CardDescription>
            Customize your coding environment like VS Code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Size */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Font Size
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <Badge variant="outline" className="min-w-[50px] justify-center">
                  {fontSize}px
                </Badge>
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Editor Theme
              </label>
              <select 
                className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={editorTheme}
                onChange={(e) => onThemeChange(e.target.value as 'vs-dark' | 'light' | 'hc-black')}
              >
                <option value="vs-dark">🌙 Dark (VS Code Dark)</option>
                <option value="light">☀️ Light</option>
                <option value="hc-black">🔲 High Contrast</option>
              </select>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Default Language</label>
              <select 
                className="w-full p-3 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as "python" | "javascript")}
              >
                <option value="python">🐍 Python</option>
                <option value="javascript">📜 JavaScript</option>
              </select>
            </div>

            {/* Word Wrap */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Text Wrapping</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={wordWrap}
                  onChange={(e) => onWordWrapChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">Enable word wrapping</span>
              </div>
            </div>

            {/* Show Errors */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Error Display</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={showErrors}
                  onChange={(e) => onShowErrorsChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">Show error panel</span>
              </div>
            </div>
          </div>
          
          {/* Keyboard Shortcuts */}
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              ⌨️ Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Run Program:</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl + F5</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Save File:</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Toggle Console:</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl + `</kbd>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Format Code:</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Shift + Alt + F</kbd>
              </div>
            </div>
          </div>

          {/* Settings Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={exportSettings} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Settings
            </Button>
            <Button onClick={importSettings} variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Import Settings
            </Button>
            <Button onClick={resetSettings} variant="outline" size="sm" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Settings */}
      <Card className="shadow-lg border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-500" />
            Programming Environment
          </CardTitle>
          <CardDescription>
            Configure programming environment and linting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Auto Save</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500">
                <option value="off">Off</option>
                <option value="afterDelay">After Delay</option>
                <option value="onFocusChange">On Focus Change</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Linting</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
                <option value="warnings-only">Warnings Only</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Indentation</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500">
                <option value="4">4 spaces</option>
                <option value="2">2 spaces</option>
                <option value="tab">Tab</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Line Endings</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500">
                <option value="auto">Auto</option>
                <option value="crlf">CRLF (Windows)</option>
                <option value="lf">LF (Unix)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controller Connection */}
      <Card className="shadow-lg border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-purple-500" />
            Controller Connection
          </CardTitle>
          <CardDescription>
            Configure connection to controller board
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Connection Type</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500">
                <option value="serial">🔌 Serial/USB</option>
                <option value="wifi">📶 WiFi</option>
                <option value="bluetooth">📱 Bluetooth</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Baud Rate</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500">
                <option value="9600">9600</option>
                <option value="115200">115200</option>
                <option value="230400">230400</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Port</label>
              <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500">
                <option value="auto">Auto Detect</option>
                <option value="COM3">COM3</option>
                <option value="COM4">COM4</option>
                <option value="/dev/ttyUSB0">/dev/ttyUSB0</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Disconnected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
