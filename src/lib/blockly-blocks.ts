import * as Blockly from 'blockly';

// Color schemes for different block categories
const MOTOR_COLOR = '#4A90E2';
const SENSOR_COLOR = '#7ED321';
const CONTROL_COLOR = '#F5A623';
const LOGIC_COLOR = '#BD10E0';
const CONTROLLER_COLOR = '#ff6b35';
const GPIO_COLOR = '#4285f4';

// ==================================================
// CONTROLLER CONFIGURATION BLOCKS
// ==================================================

// Setup Controller Block
Blockly.Blocks['setup_controller'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Setup Controller')
        .appendField(new Blockly.FieldDropdown([
          ['Arduino Uno', 'arduino_uno'],
          ['Arduino Mega', 'arduino_mega'],
          ['ESP32', 'esp32'],
          ['Raspberry Pi', 'raspberry_pi']
        ]), 'CONTROLLER_TYPE');
    this.appendDummyInput()
        .appendField('Communication:')
        .appendField(new Blockly.FieldDropdown([
          ['Serial', 'serial'],
          ['WiFi', 'wifi'],
          ['Bluetooth', 'bluetooth']
        ]), 'COMMUNICATION');
    this.setNextStatement(true, null);
    this.setColour(CONTROLLER_COLOR);
    this.setTooltip('Initialize controller board with communication protocol');
    this.setHelpUrl('');
  }
};

// Configure Pin Block
Blockly.Blocks['configure_pin'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Configure Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D2', 'D2'], ['D3', 'D3'], ['D4', 'D4'], ['D5', 'D5'], 
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9'],
          ['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3']
        ]), 'PIN')
        .appendField('as')
        .appendField(new Blockly.FieldDropdown([
          ['Digital Input', 'digital_input'],
          ['Digital Output', 'digital_output'],
          ['Analog Input', 'analog_input'],
          ['PWM Output', 'pwm_output']
        ]), 'MODE');
    this.appendDummyInput()
        .appendField('Device:')
        .appendField(new Blockly.FieldDropdown([
          ['None', 'none'],
          ['LED', 'led'],
          ['Button', 'button'],
          ['Servo Motor', 'servo'],
          ['DC Motor', 'dc_motor'],
          ['Light Sensor', 'light_sensor'],
          ['Temperature Sensor', 'temp_sensor'],
          ['Ultrasonic Sensor', 'ultrasonic']
        ]), 'DEVICE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(CONTROLLER_COLOR);
    this.setTooltip('Configure GPIO pin for specific device');
    this.setHelpUrl('');
  }
};

// Digital Write Block
Blockly.Blocks['digital_write'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Set Digital Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D2', 'D2'], ['D3', 'D3'], ['D4', 'D4'], ['D5', 'D5'], 
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9']
        ]), 'PIN')
        .appendField('to')
        .appendField(new Blockly.FieldDropdown([
          ['HIGH', 'HIGH'],
          ['LOW', 'LOW']
        ]), 'STATE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(GPIO_COLOR);
    this.setTooltip('Write digital value to pin');
    this.setHelpUrl('');
  }
};

// Digital Read Block
Blockly.Blocks['digital_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Read Digital Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D2', 'D2'], ['D3', 'D3'], ['D4', 'D4'], ['D5', 'D5'], 
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9']
        ]), 'PIN');
    this.setOutput(true, 'Boolean');
    this.setColour(GPIO_COLOR);
    this.setTooltip('Read digital value from pin');
    this.setHelpUrl('');
  }
};

// Analog Write (PWM) Block
Blockly.Blocks['analog_write'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField('Set PWM Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D3', 'D3'], ['D5', 'D5'], ['D6', 'D6'], 
          ['D9', 'D9'], ['D10', 'D10'], ['D11', 'D11']
        ]), 'PIN')
        .appendField('to');
    this.appendDummyInput()
        .appendField('(0-255)');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(GPIO_COLOR);
    this.setTooltip('Write PWM value to pin (0-255)');
    this.setHelpUrl('');
  }
};

// Analog Read Block
Blockly.Blocks['analog_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Read Analog Pin')
        .appendField(new Blockly.FieldDropdown([
          ['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3'], 
          ['A4', 'A4'], ['A5', 'A5']
        ]), 'PIN');
    this.setOutput(true, 'Number');
    this.setColour(GPIO_COLOR);
    this.setTooltip('Read analog value from pin (0-1023)');
    this.setHelpUrl('');
  }
};

// Set Pin Mode Block
Blockly.Blocks['set_pin_mode'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Set Pin')
        .appendField(new Blockly.FieldDropdown([
          ['D2', 'D2'], ['D3', 'D3'], ['D4', 'D4'], ['D5', 'D5'], 
          ['D6', 'D6'], ['D7', 'D7'], ['D8', 'D8'], ['D9', 'D9'],
          ['A0', 'A0'], ['A1', 'A1'], ['A2', 'A2'], ['A3', 'A3']
        ]), 'PIN')
        .appendField('mode to')
        .appendField(new Blockly.FieldDropdown([
          ['INPUT', 'INPUT'],
          ['OUTPUT', 'OUTPUT'],
          ['INPUT_PULLUP', 'INPUT_PULLUP']
        ]), 'MODE');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(GPIO_COLOR);
    this.setTooltip('Set pin mode for GPIO configuration');
    this.setHelpUrl('');
  }
};

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
