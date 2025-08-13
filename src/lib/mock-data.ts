// Centralized mock data for the robot programming platform

export interface Controller {
  id: string;
  name: string;
  type: "ev3" | "nxt" | "spike" | "custom";
  status: "online" | "offline" | "connecting" | "error";
  batteryLevel: number;
  connectionType: "usb" | "bluetooth" | "wifi";
  signalStrength: number;
  connectedComponents: number;
  availablePorts: number;
  firmwareVersion?: string;
  lastSeen?: Date;
}

export interface Sensor {
  id: string;
  name: string;
  type: "ultrasonic" | "color" | "touch" | "gyro" | "light" | "sound";
  port: string;
  value: number | string;
  unit: string;
  isActive: boolean;
}

export interface Motor {
  id: string;
  name: string;
  type: "large" | "medium" | "servo";
  port: string;
  power: number;
  position: number;
  isRunning: boolean;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  type: "blocks" | "python" | "javascript" | "mixed";
  lastModified: Date;
  isRunning?: boolean;
  code?: string;
  blocks?: any; // Blockly workspace data
  fileSize?: number;
}

// Mock controller data
export const mockController: Controller = {
  id: "main-controller",
  name: "My Robot Controller",
  type: "ev3",
  status: "online",
  batteryLevel: 85,
  connectionType: "usb",
  signalStrength: 4,
  connectedComponents: 6,
  availablePorts: 2,
  firmwareVersion: "1.10E",
  lastSeen: new Date(),
};

// Mock sensors data
export const mockSensors: Sensor[] = [
  {
    id: "sensor-1",
    name: "Ultrasonic Sensor",
    type: "ultrasonic",
    port: "1",
    value: 25,
    unit: "cm",
    isActive: true,
  },
  {
    id: "sensor-2",
    name: "Color Sensor",
    type: "color",
    port: "2",
    value: "red",
    unit: "",
    isActive: true,
  },
  {
    id: "sensor-3",
    name: "Touch Sensor",
    type: "touch",
    port: "3",
    value: 0,
    unit: "pressed",
    isActive: false,
  },
  {
    id: "sensor-4",
    name: "Gyro Sensor",
    type: "gyro",
    port: "4",
    value: 45,
    unit: "degrees",
    isActive: true,
  },
];

// Mock motors data
export const mockMotors: Motor[] = [
  {
    id: "motor-a",
    name: "Left Drive Motor",
    type: "large",
    port: "A",
    power: 0,
    position: 0,
    isRunning: false,
  },
  {
    id: "motor-b",
    name: "Right Drive Motor",
    type: "large",
    port: "B",
    power: 0,
    position: 0,
    isRunning: false,
  },
  {
    id: "motor-c",
    name: "Arm Motor",
    type: "medium",
    port: "C",
    power: 0,
    position: 90,
    isRunning: false,
  },
];

// Mock programs data
export const mockPrograms: Program[] = [
  {
    id: "program-1",
    name: "Basic Movement",
    description: "Simple forward and backward movement with sensor feedback",
    type: "blocks",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRunning: false,
    fileSize: 1024,
  },
  {
    id: "program-2",
    name: "Line Following",
    description: "Advanced line following algorithm using PID control",
    type: "python",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRunning: true,
    code: `#!/usr/bin/env python3
from ev3dev2.motor import LargeMotor, OUTPUT_A, OUTPUT_B
from ev3dev2.sensor.lego import ColorSensor
from ev3dev2.sensor import INPUT_2

# Initialize motors and sensors
left_motor = LargeMotor(OUTPUT_A)
right_motor = LargeMotor(OUTPUT_B)
color_sensor = ColorSensor(INPUT_2)

def follow_line():
    while True:
        # Read color sensor
        reflection = color_sensor.reflected_light_intensity
        
        # PID control logic
        if reflection > 50:
            # On white, turn left
            left_motor.on(20)
            right_motor.on(40)
        else:
            # On black, turn right
            left_motor.on(40)
            right_motor.on(20)

if __name__ == "__main__":
    follow_line()`,
    fileSize: 2048,
  },
  {
    id: "program-3",
    name: "Obstacle Avoidance",
    description: "Navigate around obstacles using ultrasonic sensor",
    type: "blocks",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRunning: false,
    fileSize: 1536,
  },
  {
    id: "program-4",
    name: "Remote Control",
    description: "Control robot remotely via bluetooth commands",
    type: "javascript",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    isRunning: false,
    code: `// Remote control robot via bluetooth
const robot = require('./robot-lib');

const commands = {
  'forward': () => robot.move(100, 100),
  'backward': () => robot.move(-100, -100),
  'left': () => robot.move(-50, 50),
  'right': () => robot.move(50, -50),
  'stop': () => robot.stop()
};

robot.onBluetoothMessage((message) => {
  const command = commands[message.toLowerCase()];
  if (command) {
    command();
  }
});`,
    fileSize: 896,
  },
];

// Mock robot configuration
export const mockRobotConfig = {
  name: "Line Following Robot",
  type: "Custom Build",
  description: "Educational robot for learning programming and robotics",
  wheels: {
    diameter: 5.6, // cm
    distance: 18.0, // cm between wheels
  },
  sensors: mockSensors.length,
  motors: mockMotors.length,
  programmingLanguages: ["Blocks", "Python", "JavaScript"],
  capabilities: [
    "Line Following",
    "Obstacle Avoidance", 
    "Remote Control",
    "Color Detection",
    "Distance Measurement",
  ],
};

// Helper functions for data manipulation
export const getRunningPrograms = () => mockPrograms.filter(p => p.isRunning);
export const getActiveSensors = () => mockSensors.filter(s => s.isActive);
export const getRunningMotors = () => mockMotors.filter(m => m.isRunning);

// API simulation helpers
export const updateControllerStatus = (status: Controller['status']) => {
  mockController.status = status;
  mockController.lastSeen = new Date();
};

export const updateSensorValue = (sensorId: string, value: number | string) => {
  const sensor = mockSensors.find(s => s.id === sensorId);
  if (sensor) {
    sensor.value = value;
  }
};

export const updateMotorPower = (motorId: string, power: number) => {
  const motor = mockMotors.find(m => m.id === motorId);
  if (motor) {
    motor.power = power;
    motor.isRunning = power !== 0;
  }
};
