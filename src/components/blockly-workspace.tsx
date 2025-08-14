"use client";

import { useEffect, useState } from "react";

interface BlocklyWorkspaceProps {
  toolboxConfig: string;
  onCodeChange?: (code: string) => void;
  onProgramChange?: (commands: any[]) => void;
}

export function BlocklyWorkspace({ toolboxConfig, onCodeChange, onProgramChange }: BlocklyWorkspaceProps) {
  const [isClient, setIsClient] = useState(false);
  const [BlocklyComponent, setBlocklyComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Only import and set the component on the client side
    const loadBlocklyComponent = async () => {
      try {
        const { default: BlocklyWorkspaceInner } = await import('./blockly-workspace-inner');
        setBlocklyComponent(() => BlocklyWorkspaceInner);
        setIsClient(true);
      } catch (error) {
        console.error('Failed to load Blockly component:', error);
      }
    };

    loadBlocklyComponent();
  }, []);

  // Don't render anything until we're on the client and component is loaded
  if (!isClient || !BlocklyComponent) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-2xl mb-2">🔧</div>
          <div className="text-lg font-medium mb-1">Loading Blockly...</div>
          <div className="text-sm">Initializing workspace</div>
        </div>
      </div>
    );
  }

  return (
    <BlocklyComponent 
      toolboxConfig={toolboxConfig}
      onCodeChange={onCodeChange}
      onProgramChange={onProgramChange}
    />
  );
}

// Toolbox configuration for your specific sensors and motors
export const ROBOT_TOOLBOX = `
<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
  
  <!-- Motor Control Category -->
  <category name="Motor Control" colour="#4A90E2">
    <block type="motor_set_power">
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
          <field name="NUM">1</field>
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
  </category>

  <!-- Sensors Category -->
  <category name="Sensors" colour="#7ED321">
    <block type="sensor_ultrasonic">
      <field name="SENSOR">ultrasonic1</field>
    </block>
    <block type="sensor_color">
      <field name="MODE">rgb</field>
    </block>
    <block type="sensor_touch">
      <field name="SENSOR">touch1</field>
    </block>
    <block type="sensor_gyro">
      <field name="AXIS">x</field>
    </block>
    <block type="sensor_ir">
      <field name="SENSOR">ir1</field>
      <field name="MODE">analog</field>
    </block>
    <block type="sensor_force">
      <field name="SENSOR">force1</field>
    </block>
    <block type="sensor_distance_tof">
      <field name="SENSOR">tof1</field>
    </block>
    <block type="sensor_temperature">
      <field name="UNIT">celsius</field>
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
    <block type="control_wait">
      <value name="DURATION">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
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
