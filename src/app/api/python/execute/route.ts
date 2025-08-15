import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface ExecuteRequest {
  code: string;
  language: 'python' | 'javascript';
  workingDirectory?: string;
  timeout?: number;
}

interface ExecuteResponse {
  success: boolean;
  output: string[];
  error: string | null;
  executionTime: number;
  exitCode: number | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: ExecuteRequest = await request.json();
    const { code, language = 'python', timeout = 30000 } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({
        success: false,
        output: [],
        error: 'No code provided',
        executionTime: 0,
        exitCode: null
      } as ExecuteResponse);
    }

    // Create temp directory if it doesn't exist
    const tempDir = join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const startTime = Date.now();
    const fileName = `script_${Date.now()}.${language === 'python' ? 'py' : 'js'}`;
    const filePath = join(tempDir, fileName);

    try {
      // Write code to temporary file
      await writeFile(filePath, code, 'utf-8');

      // Execute the code
      const result = await executeCode(filePath, language, timeout);
      
      // Clean up temporary file
      try {
        await unlink(filePath);
      } catch (unlinkError) {
        console.warn('Failed to delete temporary file:', unlinkError);
      }

      const executionTime = Date.now() - startTime;

      return NextResponse.json({
        success: result.exitCode === 0,
        output: result.output,
        error: result.error,
        executionTime,
        exitCode: result.exitCode
      } as ExecuteResponse);

    } catch (error) {
      // Clean up temporary file on error
      try {
        await unlink(filePath);
      } catch (unlinkError) {
        console.warn('Failed to delete temporary file on error:', unlinkError);
      }
      throw error;
    }

  } catch (error) {
    console.error('Python execution error:', error);
    return NextResponse.json({
      success: false,
      output: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      executionTime: 0,
      exitCode: null
    } as ExecuteResponse, { status: 500 });
  }
}

function executeCode(filePath: string, language: string, timeout: number): Promise<{
  output: string[];
  error: string | null;
  exitCode: number | null;
}> {
  return new Promise((resolve) => {
    const output: string[] = [];
    let error: string | null = null;
    let exitCode: number | null = null;

    // Determine the command to run based on language
    let command: string;
    let args: string[];
    
    if (language === 'python') {
      // Use 'py' on Windows (Python Launcher), 'python3' on Unix-like systems
      command = process.platform === 'win32' ? 'py' : 'python3';
      args = [filePath];
    } else {
      command = 'node';
      args = [filePath];
    }

    // Add common Python libraries to the environment
    const env = {
      ...process.env,
      PYTHONPATH: process.env.PYTHONPATH || '',
      // Ensure Python output is not buffered
      PYTHONUNBUFFERED: '1',
      // Set UTF-8 encoding for Python on Windows
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1'
    };

    const child = spawn(command, args, {
      env,
      cwd: process.cwd(),
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Set up timeout
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      error = `Execution timed out after ${timeout}ms`;
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
      
      resolve({ output, error, exitCode });
    });

    // Handle process error
    child.on('error', (err) => {
      clearTimeout(timer);
      
      // Provide helpful error message for Python not found
      if (err.message.includes('ENOENT') && language === 'python') {
        error = `Python not found on system. Please install Python:
        
Windows: Install from Microsoft Store or python.org
macOS: brew install python3
Linux: sudo apt install python3

After installation, restart your application.`;
      } else {
        error = `Failed to start ${command}: ${err.message}`;
      }
      
      exitCode = -1;
      resolve({ output, error, exitCode });
    });
  });
}
