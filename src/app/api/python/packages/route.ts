import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

interface InstallRequest {
  packages: string[];
  useRequirements?: boolean;
}

interface InstallResponse {
  success: boolean;
  output: string[];
  error: string | null;
  installedPackages: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: InstallRequest = await request.json();
    const { packages = [], useRequirements = false } = body;

    if (!packages.length && !useRequirements) {
      return NextResponse.json({
        success: false,
        output: [],
        error: 'No packages specified',
        installedPackages: []
      } as InstallResponse);
    }

    let command: string;
    if (useRequirements) {
      command = 'pip install -r requirements.txt';
    } else {
      command = `pip install ${packages.join(' ')}`;
    }

    const result = await executePipCommand(command);

    return NextResponse.json({
      success: result.exitCode === 0,
      output: result.output,
      error: result.error,
      installedPackages: result.exitCode === 0 ? packages : []
    } as InstallResponse);

  } catch (error) {
    console.error('Package installation error:', error);
    return NextResponse.json({
      success: false,
      output: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      installedPackages: []
    } as InstallResponse, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get list of installed packages
    const result = await executePipCommand('pip list');
    
    return NextResponse.json({
      success: result.exitCode === 0,
      output: result.output,
      error: result.error,
      installedPackages: []
    } as InstallResponse);

  } catch (error) {
    console.error('Failed to list packages:', error);
    return NextResponse.json({
      success: false,
      output: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      installedPackages: []
    } as InstallResponse, { status: 500 });
  }
}

function executePipCommand(command: string): Promise<{
  output: string[];
  error: string | null;
  exitCode: number | null;
}> {
  return new Promise((resolve) => {
    const output: string[] = [];
    let error: string | null = null;
    let exitCode: number | null = null;

    const child = spawn(command, {
      shell: true,
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1',
        PYTHONIOENCODING: 'utf-8',
        PYTHONUTF8: '1'
      }
    });

    // Set up timeout (pip operations can take a while)
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      error = 'Package installation timed out after 5 minutes';
    }, 300000); // 5 minutes

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
      
      if (err.message.includes('ENOENT')) {
        error = `Pip not found. Please ensure Python is properly installed.
        
To install Python:
• Windows: Microsoft Store or python.org
• macOS: brew install python3
• Linux: sudo apt install python3

Pip should be included with Python 3.4+ installations.`;
      } else {
        error = `Failed to execute pip command: ${err.message}`;
      }
      
      exitCode = -1;
      resolve({ output, error, exitCode });
    });
  });
}
