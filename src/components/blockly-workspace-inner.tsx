"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import * as Blockly from 'blockly';
import { generatePythonProgram, initializePythonGenerators } from '~/lib/blockly-python-generator';
import '../lib/blockly-blocks'; // Import our custom blocks
import { generateRobotCommands } from '../lib/blockly-blocks';

export interface BlocklyWorkspaceInnerProps {
  toolboxConfig: string;
  onCodeChange?: (code: string) => void;
  onProgramChange?: (commands: any[]) => void;
}

function BlocklyWorkspaceInner({ 
  toolboxConfig, 
  onCodeChange, 
  onProgramChange 
}: BlocklyWorkspaceInnerProps) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspace = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use refs to store stable references to callbacks
  const onCodeChangeRef = useRef(onCodeChange);
  const onProgramChangeRef = useRef(onProgramChange);

  // Update refs when props change
  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
    onProgramChangeRef.current = onProgramChange;
  }, [onCodeChange, onProgramChange]);

  const handleWorkspaceChange = useCallback(() => {
    if (!workspace.current) return;

    try {
      // Generate Python code
      const code = generatePythonProgram(workspace.current);
      onCodeChangeRef.current?.(code);

      // Generate robot commands for WebSocket communication
      const commands = generateRobotCommands(workspace.current);
      onProgramChangeRef.current?.(commands);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  }, []); // Empty dependency array since we use refs

  useEffect(() => {
    if (blocklyDiv.current && !isInitialized) {
      try {
        // Initialize Blockly workspace
        const ws = Blockly.inject(blocklyDiv.current, {
          toolbox: toolboxConfig,
          theme: Blockly.Themes.Classic,
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          },
          trashcan: true,
          sounds: false,
          oneBasedIndex: false,
          horizontalLayout: false,
          toolboxPosition: 'start',
          css: true,
          media: 'https://unpkg.com/blockly/media/',
          rtl: false,
          scrollbars: true,
          renderer: 'geras'
        });

        workspace.current = ws;
        setIsInitialized(true);

        // Initialize Python generators for our custom blocks
        initializePythonGenerators();

        // Listen for workspace changes
        workspace.current.addChangeListener(handleWorkspaceChange);

        // Load a sample program to demonstrate functionality
        const sampleXml = `
          <xml xmlns="https://developers.google.com/blockly/xml">
            <block type="motor_move" id="start_block" x="20" y="20">
              <field name="DIRECTION">forward</field>
              <value name="DURATION">
                <shadow type="math_number">
                  <field name="NUM">2</field>
                </shadow>
              </value>
              <next>
                <block type="control_wait">
                  <value name="DURATION">
                    <shadow type="math_number">
                      <field name="NUM">1</field>
                    </shadow>
                  </value>
                  <next>
                    <block type="motor_move">
                      <field name="DIRECTION">backward</field>
                      <value name="DURATION">
                        <shadow type="math_number">
                          <field name="NUM">2</field>
                        </shadow>
                      </value>
                      <next>
                        <block type="motor_stop"></block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </xml>
        `;
        
        try {
          const xml = Blockly.utils.xml.textToDom(sampleXml);
          Blockly.Xml.domToWorkspace(xml, workspace.current);
        } catch (error) {
          console.log('Sample program not loaded:', error);
        }

      } catch (error) {
        console.error('Failed to initialize Blockly:', error);
      }
    }

    return () => {
      if (workspace.current) {
        workspace.current.removeChangeListener(handleWorkspaceChange);
        workspace.current.dispose();
        workspace.current = null;
        setIsInitialized(false);
      }
    };
  }, [toolboxConfig]); // Only depend on toolboxConfig

  // Remove the separate listener effect since we handle it in the main effect

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (workspace.current) {
        Blockly.svgResize(workspace.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={blocklyDiv} 
      className="w-full h-full bg-white dark:bg-gray-50"
      style={{ minHeight: '400px' }}
    />
  );
}

export default BlocklyWorkspaceInner;
