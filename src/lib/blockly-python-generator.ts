import * as Blockly from 'blockly';
import { pythonGenerator, Order } from 'blockly/python';

// Flag to track if generators are initialized
let generatorsInitialized = false;

// Initialize all generators safely
function ensureGeneratorsInitialized() {
  if (generatorsInitialized) return true;
  
  try {
    setupMotorGenerators();
    setupSensorGenerators();
    setupControlGenerators();
    setupMathGenerators();
    
    generatorsInitialized = true;
    console.log('Python generators initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing generators:', error);
    return false;
  }
}

// ==================================================
// MOTOR CONTROL BLOCKS - PYTHON GENERATORS
// ==================================================

function setupMotorGenerators() {
  pythonGenerator.forBlock['motor_set_power'] = function(block: any, generator: any) {
    const motor = block.getFieldValue('MOTOR');
    const power = generator.valueToCode(block, 'POWER', Order.ATOMIC) || '0';
    
    const code = `robot.set_motor_power('${motor}', ${power})\n`;
    return code;
  };

  pythonGenerator.forBlock['motor_move'] = function(block: any, generator: any) {
    const direction = block.getFieldValue('DIRECTION');
    const duration = generator.valueToCode(block, 'DURATION', Order.ATOMIC) || '1';
    
    const code = `robot.move('${direction}', ${duration})\n`;
    return code;
  };

  pythonGenerator.forBlock['motor_stop'] = function(block: any, generator: any) {
    return 'robot.stop_all_motors()\n';
  };

  pythonGenerator.forBlock['servo_position'] = function(block: any, generator: any) {
    const servo = block.getFieldValue('SERVO');
    const angle = generator.valueToCode(block, 'ANGLE', Order.ATOMIC) || '90';
    
    const code = `robot.set_servo_position('${servo}', ${angle})\n`;
    return code;
  };
}

// ==================================================
// SENSOR BLOCKS - PYTHON GENERATORS
// ==================================================

function setupSensorGenerators() {
  pythonGenerator.forBlock['sensor_ultrasonic'] = function(block: any, generator: any) {
    const sensor = block.getFieldValue('SENSOR');
    const code = `robot.read_ultrasonic('${sensor}')`;
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['sensor_color'] = function(block: any, generator: any) {
    const mode = block.getFieldValue('MODE');
    const code = `robot.read_color_sensor('${mode}')`;
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['sensor_touch'] = function(block: any, generator: any) {
    const sensor = block.getFieldValue('SENSOR');
    const code = `robot.read_touch_sensor('${sensor}')`;
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['sensor_gyro'] = function(block: any, generator: any) {
    const axis = block.getFieldValue('AXIS');
    const code = `robot.read_gyroscope('${axis}')`;
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['sensor_ir'] = function(block: any, generator: any) {
    const sensor = block.getFieldValue('SENSOR');
    const mode = block.getFieldValue('MODE');
    const code = `robot.read_infrared('${sensor}', '${mode}')`;
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['sensor_force'] = function(block: any, generator: any) {
    const sensor = block.getFieldValue('SENSOR');
    const code = `robot.read_force_sensor('${sensor}')`;
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['sensor_distance_tof'] = function(block: any, generator: any) {
    const sensor = block.getFieldValue('SENSOR');
    const code = `robot.read_tof_sensor('${sensor}')`;
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['sensor_temperature'] = function(block: any, generator: any) {
    const unit = block.getFieldValue('UNIT');
    const code = `robot.read_temperature('${unit}')`;
    return [code, Order.ATOMIC];
  };
}

// ==================================================
// CONTROL BLOCKS - PYTHON GENERATORS
// ==================================================

function setupControlGenerators() {
  pythonGenerator.forBlock['control_wait'] = function(block: any, generator: any) {
    const duration = generator.valueToCode(block, 'DURATION', Order.ATOMIC) || '1';
    const code = `time.sleep(${duration})\n`;
    return code;
  };

  pythonGenerator.forBlock['control_if_sensor'] = function(block: any, generator: any) {
    const sensor = generator.valueToCode(block, 'SENSOR', Order.NONE) || 'False';
    const operator = block.getFieldValue('OPERATOR');
    const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
    const statements = generator.statementToCode(block, 'DO');
    
    const code = `if ${sensor} ${operator} ${value}:\n${statements}`;
    return code;
  };

  pythonGenerator.forBlock['control_repeat'] = function(block: any, generator: any) {
    const times = generator.valueToCode(block, 'TIMES', Order.ATOMIC) || '1';
    const statements = generator.statementToCode(block, 'DO');
    
    const code = `for i in range(${times}):\n${statements}`;
    return code;
  };

  pythonGenerator.forBlock['control_while'] = function(block: any, generator: any) {
    const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'False';
    const statements = generator.statementToCode(block, 'DO');
    
    const code = `while ${condition}:\n${statements}`;
    return code;
  };
}

// ==================================================
// MATH BLOCKS - PYTHON GENERATORS
// ==================================================

function setupMathGenerators() {
  // Override the default math_number generator if needed
  pythonGenerator.forBlock['math_number'] = function(block: any, generator: any) {
    const code = String(parseFloat(block.getFieldValue('NUM')));
    return [code, Order.ATOMIC];
  };

  pythonGenerator.forBlock['math_arithmetic'] = function(block: any, generator: any) {
    const operator = block.getFieldValue('OP');
    const order = (operator === '^') ? Order.EXPONENTIATION :
                 (operator === '*' || operator === '/') ? Order.MULTIPLICATIVE :
                 Order.ADDITIVE;
    
    const argument0 = generator.valueToCode(block, 'A', order) || '0';
    const argument1 = generator.valueToCode(block, 'B', order) || '0';
    
    let code;
    switch (operator) {
      case '+':
        code = argument0 + ' + ' + argument1;
        break;
      case '-':
        code = argument0 + ' - ' + argument1;
        break;
      case '*':
        code = argument0 + ' * ' + argument1;
        break;
      case '/':
        code = argument0 + ' / ' + argument1;
        break;
      case '^':
        code = argument0 + ' ** ' + argument1;
        break;
      default:
        code = argument0 + ' + ' + argument1;
    }
    
    return [code, order];
  };

  pythonGenerator.forBlock['logic_compare'] = function(block: any, generator: any) {
    const operator = block.getFieldValue('OP');
    const order = Order.RELATIONAL;
    const argument0 = generator.valueToCode(block, 'A', order) || '0';
    const argument1 = generator.valueToCode(block, 'B', order) || '0';
    
    const operators: any = {
      'EQ': '==',
      'NEQ': '!=',
      'LT': '<',
      'LTE': '<=',
      'GT': '>',
      'GTE': '>='
    };
    
    const code = argument0 + ' ' + operators[operator] + ' ' + argument1;
    return [code, order];
  };
}

// ==================================================
// UTILITY FUNCTIONS
// ==================================================

export function generatePythonCode(workspace: any): string {
  // Ensure generators are initialized
  if (!ensureGeneratorsInitialized()) {
    return '# Python generator initializing... Please wait a moment and try again.';
  }

  // Add necessary imports
  const imports = [
    'import time',
    'import math',
    '',
    '# Robot control library imports',
    'from robot_controller import RobotController',
    '',
    '# Initialize robot controller',
    'robot = RobotController()',
    ''
  ].join('\n');

  // Generate the main function
  const mainCode = pythonGenerator.workspaceToCode(workspace);
  
  const mainFunction = [
    'def main():',
    '    """Main robot program"""',
    '    try:'
  ].join('\n');

  // Indent the generated code
  const indentedCode = mainCode.split('\n')
    .filter((line: string) => line.trim() !== '')
    .map((line: string) => `        ${line}`)
    .join('\n');

  const errorHandling = [
    '    except Exception as e:',
    '        print(f"Robot program error: {e}")',
    '        robot.stop_all_motors()',
    '    finally:',
    '        robot.disconnect()',
    ''
  ].join('\n');

  const mainCall = [
    'if __name__ == "__main__":',
    '    # Connect to robot',
    '    if robot.connect():',
    '        print("Robot connected successfully")',
    '        main()',
    '    else:',
    '        print("Failed to connect to robot")'
  ].join('\n');

  return [
    imports,
    mainFunction,
    indentedCode || '        pass  # No blocks added yet',
    errorHandling,
    mainCall
  ].join('\n');
}

export function generateRobotCommands(workspace: any): any[] {
  const commands: any[] = [];
  
  // Get all top-level blocks
  const topBlocks = workspace.getTopBlocks(true);
  
  topBlocks.forEach((block: any) => {
    const blockCommands = blockToCommands(block);
    commands.push(...blockCommands);
  });
  
  return commands;
}

function blockToCommands(block: any): any[] {
  const commands: any[] = [];
  
  if (!block) return commands;
  
  const type = block.type;
  
  switch (type) {
    case 'motor_set_power':
      commands.push({
        type: 'motor_power',
        motor: block.getFieldValue('MOTOR'),
        power: getBlockValue(block, 'POWER', 0),
        timestamp: Date.now()
      });
      break;
      
    case 'motor_move':
      commands.push({
        type: 'move',
        direction: block.getFieldValue('DIRECTION'),
        duration: getBlockValue(block, 'DURATION', 1),
        timestamp: Date.now()
      });
      break;
      
    case 'motor_stop':
      commands.push({
        type: 'stop_motors',
        timestamp: Date.now()
      });
      break;
      
    case 'servo_position':
      commands.push({
        type: 'servo_control',
        servo: block.getFieldValue('SERVO'),
        angle: getBlockValue(block, 'ANGLE', 90),
        timestamp: Date.now()
      });
      break;
      
    case 'control_wait':
      commands.push({
        type: 'wait',
        duration: getBlockValue(block, 'DURATION', 1),
        timestamp: Date.now()
      });
      break;
      
    // Add sensor commands when they're used in conditions
    case 'sensor_ultrasonic':
      commands.push({
        type: 'sensor_read',
        sensor: 'ultrasonic',
        port: block.getFieldValue('SENSOR'),
        timestamp: Date.now()
      });
      break;
  }
  
  // Process next block in the chain
  const nextBlock = block.getNextBlock();
  if (nextBlock) {
    commands.push(...blockToCommands(nextBlock));
  }
  
  return commands;
}

function getBlockValue(block: any, inputName: string, defaultValue: any): any {
  const input = block.getInput(inputName);
  if (input && input.connection && input.connection.targetBlock()) {
    const targetBlock = input.connection.targetBlock();
    if (targetBlock.type === 'math_number') {
      return parseFloat(targetBlock.getFieldValue('NUM')) || defaultValue;
    }
  }
  return defaultValue;
}

// Initialize generators when module loads (in browser environment)
if (typeof window !== 'undefined') {
  // Delay initialization to ensure Blockly is fully loaded
  setTimeout(() => {
    ensureGeneratorsInitialized();
  }, 100);
}

// Export the initialization function
export { ensureGeneratorsInitialized as initializePythonGenerator };
