// Robot Communication Service
// Handles WebSocket connection to robot controller and command execution

export interface RobotCommand {
  type: string;
  timestamp: number;
  [key: string]: any;
}

import { showToast } from './toast-utils';

export interface RobotStatus {
  connected: boolean;
  running: boolean;
  position: { x: number; y: number; angle: number };
  sensors: {
    ultrasonic?: number;
    color?: { r: number; g: number; b: number };
    touch?: boolean[];
    gyro?: { x: number; y: number; z: number };
    ir?: number[];
    force?: number[];
    tof?: number[];
    temperature?: number;
  };
  motors: {
    left: { power: number; direction: string };
    right: { power: number; direction: string };
  };
  servos: { [key: string]: number };
  lastUpdate: number;
  error?: string; // Optional error message
}

class RobotService {
  private ws: WebSocket | null = null;
  private status: RobotStatus = {
    connected: false,
    running: false,
    position: { x: 0, y: 0, angle: 0 },
    sensors: {},
    motors: {
      left: { power: 0, direction: 'stop' },
      right: { power: 0, direction: 'stop' }
    },
    servos: {},
    lastUpdate: 0 // Initialize with 0 to avoid hydration issues
  };
  private listeners: ((status: RobotStatus) => void)[] = [];
  private commandQueue: RobotCommand[] = [];
  private isExecuting = false;

  constructor() {
    // Only initialize mock data in browser environment to avoid hydration issues
    if (typeof window !== 'undefined') {
      // Delay initialization to ensure it happens after hydration
      setTimeout(() => {
        this.initializeMockConnection();
      }, 100);
    }
  }

  // Initialize mock WebSocket connection for development/testing
  private initializeMockConnection() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Simulate connection
    setTimeout(() => {
      this.updateStatusWithNotification({ 
        connected: true,
        lastUpdate: Date.now()
      });
      
      // Start mock sensor updates
      this.startMockSensorUpdates();
    }, 1000);
  }

  // Connect to real robot controller
  public async connect(url: string = 'ws://localhost:8080'): Promise<void> {
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        this.updateStatusWithNotification({ connected: true });
        console.log('Connected to robot controller');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRobotMessage(data);
        } catch (error) {
          console.error('Failed to parse robot message:', error);
        }
      };

      this.ws.onclose = () => {
        this.updateStatusWithNotification({ 
          connected: false, 
          running: false 
        });
        console.log('Disconnected from robot controller');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.updateStatusWithNotification({ 
          connected: false,
          error: 'Connection error occurred'
        });
      };

    } catch (error) {
      console.error('Failed to connect to robot:', error);
      throw error;
    }
  }

  // Disconnect from robot
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.status.connected = false;
    this.status.running = false;
    this.notifyListeners();
  }

  // Execute a program (array of commands)
  public async executeProgram(commands: RobotCommand[]): Promise<void> {
    if (!this.status.connected) {
      throw new Error('Robot not connected');
    }

    if (this.isExecuting) {
      throw new Error('Program already running');
    }

    this.commandQueue = [...commands];
    this.isExecuting = true;
    this.updateStatusWithNotification({ running: true });

    try {
      await this.executeCommandQueue();
    } finally {
      this.isExecuting = false;
      this.updateStatusWithNotification({ running: false });
    }
  }

  // Stop program execution
  public stopProgram(): void {
    this.commandQueue = [];
    this.isExecuting = false;
    
    // Send stop command to robot
    this.sendCommand({ type: 'motor_stop', timestamp: Date.now() });
    this.updateStatusWithNotification({ running: false });
  }

  // Execute command queue sequentially
  private async executeCommandQueue(): Promise<void> {
    while (this.commandQueue.length > 0 && this.isExecuting) {
      const command = this.commandQueue.shift();
      if (command) {
        await this.executeCommand(command);
      }
    }
  }

  // Execute a single command
  private async executeCommand(command: RobotCommand): Promise<void> {
    console.log('Executing command:', command);
    
    switch (command.type) {
      case 'motor_power':
        await this.setMotorPower(command.motor, command.power);
        break;
      
      case 'motor_move':
        await this.moveRobot(command.direction, command.duration);
        break;
      
      case 'motor_stop':
        await this.stopMotors();
        break;
      
      case 'servo_control':
        await this.setServo(command.servo, command.angle);
        break;
      
      case 'wait':
        await this.wait(command.duration);
        break;
      
      default:
        console.warn('Unknown command type:', command.type);
    }
  }

  // Send command to robot
  private sendCommand(command: RobotCommand): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(command));
    } else {
      // Mock execution for development
      this.simulateCommand(command);
    }
  }

  // Motor control methods
  private async setMotorPower(motor: string, power: number): Promise<void> {
    const command = { type: 'motor_power', motor, power, timestamp: Date.now() };
    this.sendCommand(command);
    
    // Update local status
    if (motor === 'left' || motor === 'both') {
      this.status.motors.left.power = power;
    }
    if (motor === 'right' || motor === 'both') {
      this.status.motors.right.power = power;
    }
    this.notifyListeners();
  }

  private async moveRobot(direction: string, duration: number): Promise<void> {
    const command = { type: 'motor_move', direction, duration, timestamp: Date.now() };
    this.sendCommand(command);
    
    // Update motor status based on direction
    const power = 70; // Default power for movement
    switch (direction) {
      case 'forward':
        this.status.motors.left = { power, direction: 'forward' };
        this.status.motors.right = { power, direction: 'forward' };
        break;
      case 'backward':
        this.status.motors.left = { power, direction: 'backward' };
        this.status.motors.right = { power, direction: 'backward' };
        break;
      case 'left':
        this.status.motors.left = { power: 0, direction: 'stop' };
        this.status.motors.right = { power, direction: 'forward' };
        break;
      case 'right':
        this.status.motors.left = { power, direction: 'forward' };
        this.status.motors.right = { power: 0, direction: 'stop' };
        break;
    }
    this.notifyListeners();
    
    // Wait for duration
    await this.wait(duration);
    
    // Stop motors after movement
    await this.stopMotors();
  }

  private async stopMotors(): Promise<void> {
    const command = { type: 'motor_stop', timestamp: Date.now() };
    this.sendCommand(command);
    
    this.status.motors.left = { power: 0, direction: 'stop' };
    this.status.motors.right = { power: 0, direction: 'stop' };
    this.notifyListeners();
  }

  private async setServo(servo: string, angle: number): Promise<void> {
    const command = { type: 'servo_control', servo, angle, timestamp: Date.now() };
    this.sendCommand(command);
    
    this.status.servos[servo] = angle;
    this.notifyListeners();
  }

  private async wait(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  // Handle messages from robot
  private handleRobotMessage(data: any): void {
    if (data.type === 'status_update') {
      this.status = { ...this.status, ...data.status, lastUpdate: Date.now() };
      this.notifyListeners();
    }
  }

  // Mock sensor updates for development
  private startMockSensorUpdates(): void {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const updateInterval = setInterval(() => {
      if (!this.status.connected) {
        clearInterval(updateInterval);
        return;
      }

      // Simulate sensor readings
      this.status.sensors = {
        ultrasonic: 20 + Math.random() * 50, // 20-70 cm
        color: {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255)
        },
        touch: [Math.random() > 0.8, Math.random() > 0.8, Math.random() > 0.8, Math.random() > 0.8],
        gyro: {
          x: (Math.random() - 0.5) * 360,
          y: (Math.random() - 0.5) * 360,
          z: (Math.random() - 0.5) * 360
        },
        ir: [Math.random() * 1024, Math.random() * 1024, Math.random() * 1024, Math.random() * 1024],
        force: [Math.random() * 500, Math.random() * 500],
        tof: [Math.random() * 2000, Math.random() * 2000],
        temperature: 20 + Math.random() * 15 // 20-35°C
      };

      this.status.lastUpdate = Date.now();
      this.notifyListeners();
    }, 500); // Update every 500ms
  }

  // Simulate command execution for development
  private simulateCommand(command: RobotCommand): void {
    console.log('Simulating command:', command);
    // Mock implementation - actual robot would execute the command
  }

  // Event listeners
  public onStatusChange(listener: (status: RobotStatus) => void): void {
    this.listeners.push(listener);
  }

  public removeStatusListener(listener: (status: RobotStatus) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.status));
  }

  // Update status with toast notifications for important changes
  private updateStatusWithNotification(updates: Partial<RobotStatus>): void {
    const previousStatus = { ...this.status };
    this.status = { ...this.status, ...updates };
    
    // Show toast notifications for important status changes
    if (previousStatus.connected !== this.status.connected) {
      if (this.status.connected) {
        showToast.success('🤖 Robot connected successfully');
      } else {
        showToast.error('🤖 Robot disconnected');
      }
    }
    
    if (previousStatus.running !== this.status.running) {
      if (this.status.running) {
        showToast.info('▶️ Program started');
      } else {
        showToast.info('⏹️ Program stopped');
      }
    }
    
    if (this.status.error && this.status.error !== previousStatus.error) {
      showToast.error(`❌ Robot error: ${this.status.error}`);
    }
    
    this.notifyListeners();
  }

  // Get current status
  public getStatus(): RobotStatus {
    return { ...this.status };
  }

  // Check if connected
  public isConnected(): boolean {
    return this.status.connected;
  }

  // Check if running
  public isRunning(): boolean {
    return this.status.running;
  }
}

// Export singleton instance
export const robotService = new RobotService();
