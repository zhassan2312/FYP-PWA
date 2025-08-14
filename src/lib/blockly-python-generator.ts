import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { pythonGenerator, Order } from 'blockly/python';

// Let's make sure we have access to the real python generator
const PythonGenerator = pythonGenerator;

// Flag to track if generators are initialized
let generatorsInitialized = false;

// Initialize Python generators for our custom blocks
export function initializePythonGenerators() {
  if (generatorsInitialized) return;
  
  console.log('Initializing Python generators...');
  
  try {
    // Motor control blocks
    PythonGenerator.forBlock['motor_set_power'] = function(block: Blockly.Block) {
      const motor = block.getFieldValue('MOTOR') || 'left';
      const power = PythonGenerator.valueToCode(block, 'POWER', Order.NONE) || '0';
      return `robot.set_motor_power('${motor}', ${power})\n`;
    };

    PythonGenerator.forBlock['motor_move'] = function(block: Blockly.Block) {
      const direction = block.getFieldValue('DIRECTION') || 'forward';
      const duration = PythonGenerator.valueToCode(block, 'DURATION', Order.NONE) || '1';
      return `robot.move('${direction}', ${duration})\n`;
    };

    PythonGenerator.forBlock['motor_stop'] = function(block: Blockly.Block) {
      return `robot.stop_all_motors()\n`;
    };

    PythonGenerator.forBlock['servo_set_position'] = function(block: Blockly.Block) {
      const servo = block.getFieldValue('SERVO') || '1';
      const position = PythonGenerator.valueToCode(block, 'POSITION', Order.NONE) || '90';
      return `robot.set_servo_position('${servo}', ${position})\n`;
    };

    PythonGenerator.forBlock['servo_position'] = function(block: Blockly.Block) {
      const servo = block.getFieldValue('SERVO') || 'servo1';
      const angle = PythonGenerator.valueToCode(block, 'ANGLE', Order.NONE) || '90';
      return `robot.set_servo_position('${servo}', ${angle})\n`;
    };

    // Sensor blocks
    PythonGenerator.forBlock['sensor_ultrasonic'] = function(block: Blockly.Block) {
      const code = `robot.read_ultrasonic()`;
      return [code, Order.FUNCTION_CALL];
    };

    PythonGenerator.forBlock['sensor_color'] = function(block: Blockly.Block) {
      const component = block.getFieldValue('COMPONENT') || 'r';
      const code = `robot.read_color_sensor().${component}`;
      return [code, Order.FUNCTION_CALL];
    };

    PythonGenerator.forBlock['sensor_touch'] = function(block: Blockly.Block) {
      const port = block.getFieldValue('PORT') || '1';
      const code = `robot.read_touch_sensor('${port}')`;
      return [code, Order.FUNCTION_CALL];
    };

    PythonGenerator.forBlock['sensor_gyro'] = function(block: Blockly.Block) {
      const axis = block.getFieldValue('AXIS') || 'x';
      const code = `robot.read_gyro_sensor().${axis}`;
      return [code, Order.FUNCTION_CALL];
    };

    PythonGenerator.forBlock['sensor_ir'] = function(block: Blockly.Block) {
      const channel = block.getFieldValue('CHANNEL') || '1';
      const code = `robot.read_ir_sensor('${channel}')`;
      return [code, Order.FUNCTION_CALL];
    };

    PythonGenerator.forBlock['sensor_force'] = function(block: Blockly.Block) {
      const port = block.getFieldValue('PORT') || '1';
      const code = `robot.read_force_sensor('${port}')`;
      return [code, Order.FUNCTION_CALL];
    };

    PythonGenerator.forBlock['sensor_distance_tof'] = function(block: Blockly.Block) {
      const sensor = block.getFieldValue('SENSOR') || 'tof1';
      const code = `robot.read_tof_sensor('${sensor}')`;
      return [code, Order.FUNCTION_CALL];
    };

    PythonGenerator.forBlock['sensor_temperature'] = function(block: Blockly.Block) {
      const unit = block.getFieldValue('UNIT') || 'celsius';
      const code = `robot.read_temperature_sensor('${unit}')`;
      return [code, Order.FUNCTION_CALL];
    };

    // Control blocks
    PythonGenerator.forBlock['control_wait'] = function(block: Blockly.Block) {
      const duration = PythonGenerator.valueToCode(block, 'DURATION', Order.NONE) || '1';
      return `time.sleep(${duration})\n`;
    };

    generatorsInitialized = true;
    console.log('Python generators initialized successfully');
    
    // Log all registered generators for debugging
    console.log('Registered Python generators:', Object.keys(PythonGenerator.forBlock));
    
  } catch (error) {
    console.error('Error initializing Python generators:', error);
  }
}

// Sensor blocks
(pythonGenerator as any)['sensor_ultrasonic'] = function(block: Blockly.Block) {
  const code = `robot.read_ultrasonic()`;
  return [code, Order.FUNCTION_CALL];
};

(pythonGenerator as any)['sensor_color'] = function(block: Blockly.Block) {
  const component = block.getFieldValue('COMPONENT') || 'r';
  const code = `robot.read_color_sensor().${component}`;
  return [code, Order.FUNCTION_CALL];
};

(pythonGenerator as any)['sensor_touch'] = function(block: Blockly.Block) {
  const port = block.getFieldValue('PORT') || '1';
  const code = `robot.read_touch_sensor('${port}')`;
  return [code, Order.FUNCTION_CALL];
};

(pythonGenerator as any)['sensor_gyro'] = function(block: Blockly.Block) {
  const axis = block.getFieldValue('AXIS') || 'x';
  const code = `robot.read_gyro_sensor().${axis}`;
  return [code, Order.FUNCTION_CALL];
};

(pythonGenerator as any)['sensor_ir'] = function(block: Blockly.Block) {
  const channel = block.getFieldValue('CHANNEL') || '1';
  const code = `robot.read_ir_sensor('${channel}')`;
  return [code, Order.FUNCTION_CALL];
};

(pythonGenerator as any)['sensor_force'] = function(block: Blockly.Block) {
  const port = block.getFieldValue('PORT') || '1';
  const code = `robot.read_force_sensor('${port}')`;
  return [code, Order.FUNCTION_CALL];
};

(pythonGenerator as any)['sensor_distance_tof'] = function(block: Blockly.Block) {
  const sensor = block.getFieldValue('SENSOR') || 'tof1';
  const code = `robot.read_tof_sensor('${sensor}')`;
  return [code, Order.FUNCTION_CALL];
};

(pythonGenerator as any)['sensor_temperature'] = function(block: Blockly.Block) {
  const unit = block.getFieldValue('UNIT') || 'celsius';
  const code = `robot.read_temperature_sensor('${unit}')`;
  return [code, Order.FUNCTION_CALL];
};

// Utility function to generate complete Python program
export function generatePythonProgram(workspace: Blockly.Workspace): string {
  // Initialize Python generators for our custom blocks
  initializePythonGenerators();
  
  try {
    console.log('Generating Python code from workspace...');
    
    // Get all top-level blocks in the workspace
    const topBlocks = workspace.getTopBlocks(true);
    console.log('Top-level blocks:', topBlocks.map(block => block.type));
    
    // Generate the main code using the Python generator
    const code = PythonGenerator.workspaceToCode(workspace);
    
    console.log('Generated raw Python code:', code);
    
    // Create the complete Python program
    let fullCode = '# Generated Python code for robot control\n';
    fullCode += 'import time\n';
    fullCode += 'import math\n';
    fullCode += '\n';
    fullCode += '# Robot control library imports\n';
    fullCode += 'from robot_controller import RobotController\n';
    fullCode += '\n';
    fullCode += '# Initialize robot controller\n';
    fullCode += 'robot = RobotController()\n';
    fullCode += '\n';
    fullCode += 'def main():\n';
    fullCode += '    """Main robot program"""\n';
    
    if (code.trim()) {
      // Indent the main code
      const indentedCode = code.split('\n').map((line: string) => 
        line.trim() ? '    ' + line : line
      ).join('\n');
      fullCode += indentedCode;
    } else {
      fullCode += '    pass  # No commands generated\n';
    }
    
    fullCode += '\n\nif __name__ == "__main__":\n';
    fullCode += '    main()\n';
    
    console.log('Final Python program:', fullCode);
    return fullCode;
    
  } catch (error) {
    console.error('Error generating Python code:', error);
    
    // Try to provide more detailed error information
    if (error instanceof Error) {
      const errorMessage = error.message;
      if (errorMessage.includes('does not know how to generate code for block type')) {
        const blockType = errorMessage.match(/block type "([^"]+)"/)?.[1];
        return `# Error: Missing Python generator for block type "${blockType}"\n# Please add a Python generator for this block type in blockly-python-generator.ts\n\n# Available generators: ${Object.keys(PythonGenerator.forBlock).join(', ')}`;
      }
    }
    
    return `# Error generating Python code: ${error}\n# Please check the console for more details.`;
  }
}

export default PythonGenerator;
