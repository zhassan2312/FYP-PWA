// Python Execution Service
// Handles code execution, terminal commands, and package management

export interface PythonExecutionResult {
  success: boolean;
  output: string[];
  error: string | null;
  executionTime: number;
  exitCode: number | null;
}

export interface TerminalCommandResult {
  success: boolean;
  output: string[];
  error: string | null;
  exitCode: number | null;
  workingDirectory: string;
}

export interface PackageInstallResult {
  success: boolean;
  output: string[];
  error: string | null;
  installedPackages: string[];
}

class PythonService {
  private currentWorkingDirectory: string = '';

  // Execute Python code
  async executeCode(code: string, language: 'python' | 'javascript' = 'python'): Promise<PythonExecutionResult> {
    try {
      const response = await fetch('/api/python/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          workingDirectory: this.currentWorkingDirectory,
          timeout: 30000
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PythonExecutionResult = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        output: [],
        error: error instanceof Error ? error.message : 'Failed to execute code',
        executionTime: 0,
        exitCode: null
      };
    }
  }

  // Execute terminal command
  async executeTerminalCommand(command: string): Promise<TerminalCommandResult> {
    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          workingDirectory: this.currentWorkingDirectory,
          timeout: 30000
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TerminalCommandResult = await response.json();
      
      // Update working directory if the command was successful
      if (result.success && result.workingDirectory) {
        this.currentWorkingDirectory = result.workingDirectory;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        output: [],
        error: error instanceof Error ? error.message : 'Failed to execute command',
        exitCode: null,
        workingDirectory: this.currentWorkingDirectory
      };
    }
  }

  // Install Python packages
  async installPackages(packages: string[]): Promise<PackageInstallResult> {
    try {
      const response = await fetch('/api/python/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packages,
          useRequirements: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PackageInstallResult = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        output: [],
        error: error instanceof Error ? error.message : 'Failed to install packages',
        installedPackages: []
      };
    }
  }

  // Install from requirements.txt
  async installFromRequirements(): Promise<PackageInstallResult> {
    try {
      const response = await fetch('/api/python/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packages: [],
          useRequirements: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PackageInstallResult = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        output: [],
        error: error instanceof Error ? error.message : 'Failed to install from requirements.txt',
        installedPackages: []
      };
    }
  }

  // List installed packages
  async listPackages(): Promise<PackageInstallResult> {
    try {
      const response = await fetch('/api/python/packages', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PackageInstallResult = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        output: [],
        error: error instanceof Error ? error.message : 'Failed to list packages',
        installedPackages: []
      };
    }
  }

  // Get current working directory
  getCurrentWorkingDirectory(): string {
    return this.currentWorkingDirectory;
  }

  // Set working directory
  setCurrentWorkingDirectory(directory: string): void {
    this.currentWorkingDirectory = directory;
  }

  // Quick Python environment setup
  async setupPythonEnvironment(): Promise<{
    pythonVersion: string | null;
    pipVersion: string | null;
    success: boolean;
    output: string[];
  }> {
    try {
      const pythonCheck = await this.executeTerminalCommand('python --version');
      const pipCheck = await this.executeTerminalCommand('pip --version');

      return {
        pythonVersion: pythonCheck.success ? (pythonCheck.output[0] || null) : null,
        pipVersion: pipCheck.success ? (pipCheck.output[0] || null) : null,
        success: pythonCheck.success && pipCheck.success,
        output: [...pythonCheck.output, ...pipCheck.output]
      };
    } catch (error) {
      return {
        pythonVersion: null,
        pipVersion: null,
        success: false,
        output: [`Error checking Python environment: ${error}`]
      };
    }
  }

  // Common robotics packages installation
  async installRoboticsPackages(): Promise<PackageInstallResult> {
    const roboticsPackages = [
      'numpy',
      'opencv-python',
      'matplotlib',
      'scipy',
      'pandas',
      'pyserial',
      'RPi.GPIO', // For Raspberry Pi GPIO control
      'adafruit-circuitpython-motor',
      'adafruit-circuitpython-servo',
      'adafruit-circuitpython-ultrasonic',
      'requests', // For HTTP communication
      'websocket-client' // For WebSocket communication
    ];

    return this.installPackages(roboticsPackages);
  }
}

// Create singleton instance
const pythonService = new PythonService();
export default pythonService;
