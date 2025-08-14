import * as Blockly from 'blockly';

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
// INITIALIZATION FUNCTION
// ==================================================

/**
 * Initialize all custom blocks
 * Must be called before using the blocks in a workspace
 */
function initializeCustomBlocks() {
  console.log('Initializing custom robot blocks...');
  
  // Blocks are already defined above, but we can do any additional setup here
  // For example, adding them to the toolbox categories
  
  console.log('Custom robot blocks initialized successfully');
  return true;
}

// Export the Blockly instance and initialization function
export { Blockly, initializeCustomBlocks };
