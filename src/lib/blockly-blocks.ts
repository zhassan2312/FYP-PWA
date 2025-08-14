import * as Blockly from 'blockly';
// Import the JavaScript generator
import { javascriptGenerator, Order } from 'blockly/javascript';

// Color schemes for different block categories
const MOTOR_COLOR = '#4A90E2';
const SENSOR_COLOR = '#7ED321';
const CONTROL_COLOR = '#F5A623';
const LOGIC_COLOR = '#BD10E0';

// ==================================================
// MOTOR CONTROL BLOCKS
// ==================================================

// Set Motor Power Block
Blockly.Blocks['motor_set_power'] = {
  init: function() {
    this.appendValueInput('POWER')
        .setCheck('Number')
        .appendField('Set')
        .appendField(new Blockly.FieldDropdown([
          ['Left Motor', 'left'],
          ['Right Motor', 'right'],
          ['Both Motors', 'both']
        ]), 'MOTOR')
        .appendField('power to');
    this.appendDummyInput()
        .appendField('%');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOTOR_COLOR);
    this.setTooltip('Set motor power (0-100%). TB6612FNG/DRV8833 compatible.');
    this.setHelpUrl('');
  }
};

// Motor Movement Block
Blockly.Blocks['motor_move'] = {
  init: function() {
    this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('Move')
        .appendField(new Blockly.FieldDropdown([
          ['Forward', 'forward'],
          ['Backward', 'backward'],
          ['Turn Left', 'left'],
          ['Turn Right', 'right']
        ]), 'DIRECTION')
        .appendField('for');
    this.appendDummyInput()
        .appendField('seconds');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOTOR_COLOR);
    this.setTooltip('Move robot in specified direction for given time.');
    this.setHelpUrl('');
  }
};

// Stop Motors Block
Blockly.Blocks['motor_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Stop all motors');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOTOR_COLOR);
    this.setTooltip('Stop all motors immediately.');
    this.setHelpUrl('');
  }
};

// Servo Control Block
Blockly.Blocks['servo_position'] = {
  init: function() {
    this.appendValueInput('ANGLE')
        .setCheck('Number')
        .appendField('Set')
        .appendField(new Blockly.FieldDropdown([
          ['Servo 1', 'servo1'],
          ['Servo 2', 'servo2'],
          ['Servo 3', 'servo3'],
          ['Servo 4', 'servo4']
        ]), 'SERVO')
        .appendField('to');
    this.appendDummyInput()
        .appendField('degrees');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(MOTOR_COLOR);
    this.setTooltip('Set servo position (0-180 degrees).');
    this.setHelpUrl('');
  }
};

// ==================================================
// SENSOR BLOCKS
// ==================================================

// Ultrasonic Distance Sensor
Blockly.Blocks['sensor_ultrasonic'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Ultrasonic')
        .appendField(new Blockly.FieldDropdown([
          ['Sensor 1', 'ultrasonic1'],
          ['Sensor 2', 'ultrasonic2']
        ]), 'SENSOR')
        .appendField('distance (cm)');
    this.setOutput(true, 'Number');
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Read ultrasonic distance sensor (2-400cm).');
    this.setHelpUrl('');
  }
};

// Color Sensor
Blockly.Blocks['sensor_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Color sensor')
        .appendField(new Blockly.FieldDropdown([
          ['RGB Values', 'rgb'],
          ['Basic Color', 'color'],
          ['Red Value', 'red'],
          ['Green Value', 'green'],
          ['Blue Value', 'blue']
        ]), 'MODE');
    this.setOutput(true, null);
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Read color sensor data.');
    this.setHelpUrl('');
  }
};

// Touch Sensor
Blockly.Blocks['sensor_touch'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Touch sensor')
        .appendField(new Blockly.FieldDropdown([
          ['1', 'touch1'],
          ['2', 'touch2'],
          ['3', 'touch3'],
          ['4', 'touch4']
        ]), 'SENSOR')
        .appendField('is pressed');
    this.setOutput(true, 'Boolean');
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Check if touch sensor is pressed.');
    this.setHelpUrl('');
  }
};

// Gyroscope Sensor
Blockly.Blocks['sensor_gyro'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Gyro')
        .appendField(new Blockly.FieldDropdown([
          ['X-axis', 'x'],
          ['Y-axis', 'y'],
          ['Z-axis', 'z'],
          ['Heading', 'heading']
        ]), 'AXIS')
        .appendField('angle');
    this.setOutput(true, 'Number');
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Read gyroscope angle (-180 to 180 degrees).');
    this.setHelpUrl('');
  }
};

// IR Sensor
Blockly.Blocks['sensor_ir'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('IR sensor')
        .appendField(new Blockly.FieldDropdown([
          ['1', 'ir1'],
          ['2', 'ir2'],
          ['3', 'ir3'],
          ['4', 'ir4']
        ]), 'SENSOR')
        .appendField(new Blockly.FieldDropdown([
          ['value', 'analog'],
          ['detected', 'digital']
        ]), 'MODE');
    this.setOutput(true, null);
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Read IR sensor (analog value or digital detection).');
    this.setHelpUrl('');
  }
};

// Force Sensor
Blockly.Blocks['sensor_force'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Force sensor')
        .appendField(new Blockly.FieldDropdown([
          ['1', 'force1'],
          ['2', 'force2']
        ]), 'SENSOR')
        .appendField('value');
    this.setOutput(true, 'Number');
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Read force sensor value.');
    this.setHelpUrl('');
  }
};

// Distance ToF Sensor
Blockly.Blocks['sensor_distance_tof'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('ToF distance')
        .appendField(new Blockly.FieldDropdown([
          ['1', 'tof1'],
          ['2', 'tof2']
        ]), 'SENSOR')
        .appendField('(mm)');
    this.setOutput(true, 'Number');
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Read Time-of-Flight distance sensor (0.1-8000mm).');
    this.setHelpUrl('');
  }
};

// Temperature Sensor
Blockly.Blocks['sensor_temperature'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Temperature sensor')
        .appendField(new Blockly.FieldDropdown([
          ['°C', 'celsius'],
          ['°F', 'fahrenheit']
        ]), 'UNIT');
    this.setOutput(true, 'Number');
    this.setColour(SENSOR_COLOR);
    this.setTooltip('Read temperature sensor (-40 to 85°C).');
    this.setHelpUrl('');
  }
};

// ==================================================
// CONTROL FLOW BLOCKS
// ==================================================

// Wait Block
Blockly.Blocks['control_wait'] = {
  init: function() {
    this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('Wait');
    this.appendDummyInput()
        .appendField('seconds');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CONTROL_COLOR);
    this.setTooltip('Wait for specified number of seconds.');
    this.setHelpUrl('');
  }
};

// ==================================================
// CODE GENERATORS (JavaScript)
// ==================================================

// Motor control generators
javascriptGenerator.forBlock['motor_set_power'] = function(block: any) {
  const motor = block.getFieldValue('MOTOR');
  const power = javascriptGenerator.valueToCode(block, 'POWER', Order.ATOMIC) || '0';
  return `robot.setMotorPower('${motor}', ${power});\n`;
};

javascriptGenerator.forBlock['motor_move'] = function(block: any) {
  const direction = block.getFieldValue('DIRECTION');
  const duration = javascriptGenerator.valueToCode(block, 'DURATION', Order.ATOMIC) || '1';
  return `robot.move('${direction}', ${duration});\n`;
};

javascriptGenerator.forBlock['motor_stop'] = function(block: any) {
  return 'robot.stopMotors();\n';
};

javascriptGenerator.forBlock['servo_position'] = function(block: any) {
  const servo = block.getFieldValue('SERVO');
  const angle = javascriptGenerator.valueToCode(block, 'ANGLE', Order.ATOMIC) || '90';
  return `robot.setServo('${servo}', ${angle});\n`;
};

// Sensor generators
javascriptGenerator.forBlock['sensor_ultrasonic'] = function(block: any) {
  const sensor = block.getFieldValue('SENSOR');
  const code = `robot.readUltrasonic('${sensor}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['sensor_color'] = function(block: any) {
  const mode = block.getFieldValue('MODE');
  const code = `robot.readColor('${mode}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['sensor_touch'] = function(block: any) {
  const sensor = block.getFieldValue('SENSOR');
  const code = `robot.readTouch('${sensor}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['sensor_gyro'] = function(block: any) {
  const axis = block.getFieldValue('AXIS');
  const code = `robot.readGyro('${axis}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['sensor_ir'] = function(block: any) {
  const sensor = block.getFieldValue('SENSOR');
  const mode = block.getFieldValue('MODE');
  const code = `robot.readIR('${sensor}', '${mode}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['sensor_force'] = function(block: any) {
  const sensor = block.getFieldValue('SENSOR');
  const code = `robot.readForce('${sensor}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['sensor_distance_tof'] = function(block: any) {
  const sensor = block.getFieldValue('SENSOR');
  const code = `robot.readToF('${sensor}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['sensor_temperature'] = function(block: any) {
  const unit = block.getFieldValue('UNIT');
  const code = `robot.readTemperature('${unit}')`;
  return [code, Order.FUNCTION_CALL];
};

javascriptGenerator.forBlock['control_wait'] = function(block: any) {
  const duration = javascriptGenerator.valueToCode(block, 'DURATION', Order.ATOMIC) || '1';
  return `robot.wait(${duration});\n`;
};

// ==================================================
// JSON IR GENERATORS (for WebSocket communication)
// ==================================================

// Generate JSON command format for robot communication
export function generateRobotCommands(workspace: any): any[] {
  const blocks = workspace.getTopBlocks(true);
  const commands: any[] = [];
  
  blocks.forEach((block: any) => {
    const command = blockToCommand(block);
    if (command) {
      commands.push(command);
    }
  });
  
  return commands;
}

function blockToCommand(block: any): any {
  if (!block) return null;
  
  const type = block.type;
  
  switch (type) {
    case 'motor_set_power':
      return {
        type: 'motor_power',
        motor: block.getFieldValue('MOTOR'),
        power: parseFloat(block.getInputTargetBlock('POWER')?.getFieldValue('NUM') || '0'),
        timestamp: Date.now()
      };
      
    case 'motor_move':
      return {
        type: 'motor_move',
        direction: block.getFieldValue('DIRECTION'),
        duration: parseFloat(block.getInputTargetBlock('DURATION')?.getFieldValue('NUM') || '1') * 1000,
        timestamp: Date.now()
      };
      
    case 'motor_stop':
      return {
        type: 'motor_stop',
        timestamp: Date.now()
      };
      
    case 'servo_position':
      return {
        type: 'servo_control',
        servo: block.getFieldValue('SERVO'),
        angle: parseFloat(block.getInputTargetBlock('ANGLE')?.getFieldValue('NUM') || '90'),
        timestamp: Date.now()
      };
      
    case 'control_wait':
      return {
        type: 'wait',
        duration: parseFloat(block.getInputTargetBlock('DURATION')?.getFieldValue('NUM') || '1') * 1000,
        timestamp: Date.now()
      };
      
    default:
      return null;
  }
}

export { Blockly, javascriptGenerator };
