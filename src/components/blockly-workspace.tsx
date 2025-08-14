"use client";

import { useEffect, useRef } from "react";

// Blockly integration component - this would use the actual Blockly library
// For now, this is a placeholder that shows how it would be structured

interface BlocklyWorkspaceProps {
  toolboxConfig: string;
  onCodeChange?: (code: string) => void;
}

export function BlocklyWorkspace({ toolboxConfig, onCodeChange }: BlocklyWorkspaceProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<any>(null);

  useEffect(() => {
    if (blocklyDiv.current) {
      // This is where you would initialize Blockly
      // const workspace = Blockly.inject(blocklyDiv.current, {
      //   toolbox: toolboxConfig,
      //   theme: Blockly.Themes.Modern,
      //   grid: {
      //     spacing: 20,
      //     length: 3,
      //     colour: '#ccc',
      //     snap: true
      //   },
      //   zoom: {
      //     controls: true,
      //     wheel: true,
      //     startScale: 1.0,
      //     maxScale: 3,
      //     minScale: 0.3,
      //     scaleSpeed: 1.2
      //   }
      // });

      // workspace.current = workspace;

      // // Listen for changes and generate code
      // workspace.addChangeListener(() => {
      //   const code = Blockly.JavaScript.workspaceToCode(workspace);
      //   onCodeChange?.(code);
      // });
    }

    return () => {
      // Cleanup
      workspace.current?.dispose();
    };
  }, [toolboxConfig, onCodeChange]);

  return (
    <div 
      ref={blocklyDiv} 
      className="w-full h-full bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center"
    >
      <div className="text-center text-gray-500 dark:text-gray-400">
        <div className="text-2xl mb-2">🔧</div>
        <div className="text-lg font-medium mb-1">Blockly Workspace</div>
        <div className="text-sm">Drag blocks from the palette to build your program</div>
        <div className="text-xs mt-2 text-gray-400">
          (Actual Blockly integration would render here)
        </div>
      </div>
    </div>
  );
}

// Toolbox configuration for your specific sensors and motors
export const ROBOT_TOOLBOX = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
  
  <!-- Motor Control Category -->
  <category name="Motor Control" colour="#4A90E2">
    <block type="motor_power">
      <field name="MOTOR">left</field>
      <value name="POWER">
        <shadow type="math_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
    </block>
    <block type="motor_move">
      <field name="DIRECTION">forward</field>
      <value name="DURATION">
        <shadow type="math_number">
          <field name="NUM">1000</field>
        </shadow>
      </value>
    </block>
    <block type="motor_turn">
      <field name="DIRECTION">left</field>
      <value name="ANGLE">
        <shadow type="math_number">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>
    <block type="motor_stop"></block>
    <block type="servo_position">
      <field name="SERVO">servo1</field>
      <value name="ANGLE">
        <shadow type="math_number">
          <field name="NUM">90</field>
        </shadow>
      </value>
    </block>
    <block type="stepper_steps">
      <field name="STEPPER">stepper1</field>
      <value name="STEPS">
        <shadow type="math_number">
          <field name="NUM">200</field>
        </shadow>
      </value>
    </block>
  </category>

  <!-- Sensors Category -->
  <category name="Sensors" colour="#7ED321">
    <block type="sensor_ultrasonic">
      <field name="SENSOR">ultrasonic1</field>
    </block>
    <block type="sensor_color">
      <field name="SENSOR">color1</field>
    </block>
    <block type="sensor_touch">
      <field name="SENSOR">touch1</field>
    </block>
    <block type="sensor_gyro">
      <field name="SENSOR">gyro1</field>
      <field name="AXIS">x</field>
    </block>
    <block type="sensor_ir">
      <field name="SENSOR">ir1</field>
    </block>
    <block type="sensor_force">
      <field name="SENSOR">force1</field>
    </block>
    <block type="sensor_distance_tof">
      <field name="SENSOR">tof1</field>
    </block>
    <block type="sensor_temperature">
      <field name="SENSOR">temp1</field>
    </block>
  </category>

  <!-- Control Flow Category -->
  <category name="Control" colour="#F5A623">
    <block type="controls_if"></block>
    <block type="controls_if">
      <mutation else="1"></mutation>
    </block>
    <block type="controls_repeat_ext">
      <value name="TIMES">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>
    <block type="controls_whileUntil">
      <field name="MODE">WHILE</field>
    </block>
    <block type="controls_flow_statements">
      <field name="FLOW">BREAK</field>
    </block>
  </category>

  <!-- Logic Category -->
  <category name="Logic" colour="#BD10E0">
    <block type="logic_compare">
      <field name="OP">EQ</field>
    </block>
    <block type="logic_operation">
      <field name="OP">AND</field>
    </block>
    <block type="logic_negate"></block>
    <block type="logic_boolean">
      <field name="BOOL">TRUE</field>
    </block>
    <block type="logic_null"></block>
    <block type="logic_ternary"></block>
  </category>

  <!-- Math Category -->
  <category name="Math" colour="#5B4CF4">
    <block type="math_number">
      <field name="NUM">0</field>
    </block>
    <block type="math_arithmetic">
      <field name="OP">ADD</field>
      <value name="A">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="B">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>
    <block type="math_single">
      <field name="OP">ROOT</field>
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">9</field>
        </shadow>
      </value>
    </block>
    <block type="math_trig">
      <field name="OP">SIN</field>
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM">45</field>
        </shadow>
      </value>
    </block>
    <block type="math_constant">
      <field name="CONSTANT">PI</field>
    </block>
    <block type="math_random_int">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">100</field>
        </shadow>
      </value>
    </block>
  </category>

  <!-- Variables Category -->
  <category name="Variables" colour="#FF6B35" custom="VARIABLE"></category>

  <!-- Functions Category -->
  <category name="Functions" colour="#9013FE" custom="PROCEDURE"></category>

</xml>
`;
