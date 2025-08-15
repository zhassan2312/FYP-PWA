import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

interface TerminalRequest {
  command: string;
  workingDirectory?: string;
  timeout?: number;
}

interface TerminalResponse {
  success: boolean;
  output: string[];
  error: string | null;
  exitCode: number | null;
  workingDirectory: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TerminalRequest = await request.json();
    const { command, workingDirectory = process.cwd(), timeout = 30000 } = body;

    if (!command || !command.trim()) {
      return NextResponse.json({
        success: false,
        output: [],
        error: 'No command provided',
        exitCode: null,
        workingDirectory
      } as TerminalResponse);
    }

    const result = await executeTerminalCommand(command, workingDirectory, timeout);

    return NextResponse.json({
      success: result.exitCode === 0,
      output: result.output,
      error: result.error,
      exitCode: result.exitCode,
      workingDirectory: result.workingDirectory
    } as TerminalResponse);

  } catch (error) {
    console.error('Terminal command error:', error);
    return NextResponse.json({
      success: false,
      output: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      exitCode: null,
      workingDirectory: process.cwd()
    } as TerminalResponse, { status: 500 });
  }
}

function executeTerminalCommand(command: string, workingDirectory: string, timeout: number): Promise<{
  output: string[];
  error: string | null;
  exitCode: number | null;
  workingDirectory: string;
}> {
  return new Promise((resolve) => {
    const output: string[] = [];
    let error: string | null = null;
    let exitCode: number | null = null;

    // Handle special commands
    if (command.trim() === 'clear') {
      resolve({
        output: ['Terminal cleared'],
        error: null,
        exitCode: 0,
        workingDirectory
      });
      return;
    }

    // Handle cd commands
    if (command.trim().startsWith('cd ')) {
      const newDir = command.trim().substring(3).trim();
      try {
        const path = require('path');
        const fs = require('fs');
        const targetDir = path.resolve(workingDirectory, newDir);
        
        if (fs.existsSync(targetDir) && fs.statSync(targetDir).isDirectory()) {
          resolve({
            output: [`Changed directory to: ${targetDir}`],
            error: null,
            exitCode: 0,
            workingDirectory: targetDir
          });
        } else {
          resolve({
            output: [],
            error: `Directory not found: ${targetDir}`,
            exitCode: 1,
            workingDirectory
          });
        }
      } catch (err) {
        resolve({
          output: [],
          error: `Failed to change directory: ${err}`,
          exitCode: 1,
          workingDirectory
        });
      }
      return;
    }

    // Handle pwd command
    if (command.trim() === 'pwd') {
      resolve({
        output: [workingDirectory],
        error: null,
        exitCode: 0,
        workingDirectory
      });
      return;
    }

    // Execute the command
    const child = spawn(command, {
      shell: true,
      cwd: workingDirectory,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1', // Ensure Python output is not buffered
        PYTHONIOENCODING: 'utf-8', // Set UTF-8 encoding for Python
        PYTHONUTF8: '1' // Enable UTF-8 mode on Python 3.7+
      }
    });

    // Set up timeout
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      error = `Command timed out after ${timeout}ms`;
    }, timeout);

    // Capture stdout
    child.stdout?.on('data', (data) => {
      const lines = data.toString().split('\n').filter((line: string) => line.trim());
      output.push(...lines);
    });

    // Capture stderr
    child.stderr?.on('data', (data) => {
      const errorLines = data.toString().split('\n').filter((line: string) => line.trim());
      if (error) {
        error += '\n' + errorLines.join('\n');
      } else {
        error = errorLines.join('\n');
      }
    });

    // Handle process completion
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      exitCode = code;
      
      if (signal === 'SIGTERM') {
        error = error || 'Process terminated due to timeout';
      }
      
      resolve({ output, error, exitCode, workingDirectory });
    });

    // Handle process error
    child.on('error', (err) => {
      clearTimeout(timer);
      
      // Provide helpful error messages for common issues
      if (err.message.includes('ENOENT')) {
        if (command.includes('python')) {
          error = `Python not found. Please install Python and add it to your PATH.
          
Installation options:
• Windows: Microsoft Store or python.org
• macOS: brew install python3  
• Linux: sudo apt install python3

After installation, restart the application.`;
        } else if (command.includes('pip')) {
          error = `Pip not found. Please ensure Python is properly installed with pip included.`;
        } else {
          error = `Command not found: ${command.split(' ')[0]}`;
        }
      } else {
        error = `Failed to execute command: ${err.message}`;
      }
      
      exitCode = -1;
      resolve({ output, error, exitCode, workingDirectory });
    });
  });
}
