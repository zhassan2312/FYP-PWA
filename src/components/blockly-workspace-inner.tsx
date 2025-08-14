"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import * as Blockly from 'blockly';
import { generatePythonCode, generateRobotCommands, initializePythonGenerator } from '~/lib/blockly-python-generator';
import { initializeCustomBlocks } from '~/lib/blockly-blocks';

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
    if (!workspace.current) {
      console.log('Workspace not available');
      return;
    }

    try {
      console.log('Workspace changed, generating code...');
      
      // Generate Python code
      const code = generatePythonCode(workspace.current);
      console.log('Generated Python code:', code);
      onCodeChangeRef.current?.(code);

      // Generate robot commands for WebSocket communication
      const commands = generateRobotCommands(workspace.current);
      console.log('Generated robot commands:', commands);
      onProgramChangeRef.current?.(commands);
    } catch (error) {
      console.error('Error generating code:', error);
      // Fallback to empty values
      onCodeChangeRef.current?.('// Error generating code. Please check console for details.');
      onProgramChangeRef.current?.([]);
    }
  }, []); // Empty dependency array since we use refs

  useEffect(() => {
    if (blocklyDiv.current && !isInitialized) {
      try {
        console.log('Initializing Blockly workspace...');
        
        // Initialize custom blocks first
        initializeCustomBlocks();
        
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

        // Define sample program XML
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

        // Initialize Python generator and set up listeners
        const initializePythonAndListeners = async () => {
          try {
            console.log('Starting Python generator initialization...');
            
            // Force import of Python generator with retry logic
            let attempts = 0;
            const maxAttempts = 5;
            let success = false;
            
            while (attempts < maxAttempts && !success) {
              try {
                await import('blockly/python');
                console.log('Python generator module imported, attempt:', attempts + 1);
                
                // Wait a bit for the module to fully initialize
                await new Promise(resolve => setTimeout(resolve, 200));
                
                // Try to initialize our custom Python generators
                success = await initializePythonGenerator();
                if (success) {
                  console.log('Custom Python generators initialized successfully');
                  break;
                } else {
                  console.warn(`Failed to initialize Python generators, attempt ${attempts + 1}`);
                  await new Promise(resolve => setTimeout(resolve, 300));
                }
              } catch (error) {
                console.warn(`Import attempt ${attempts + 1} failed:`, error);
                await new Promise(resolve => setTimeout(resolve, 300));
              }
              attempts++;
            }
            
            if (!success) {
              console.error('Failed to initialize Python generators after all attempts');
            }
            
            // Listen for workspace changes regardless of generator status
            workspace.current.addChangeListener(handleWorkspaceChange);
            console.log('Workspace change listener added');

            // Load sample program
            try {
              const xml = Blockly.utils.xml.textToDom(sampleXml);
              Blockly.Xml.domToWorkspace(xml, workspace.current);
              console.log('Sample program loaded');
            } catch (error) {
              console.log('Sample program not loaded:', error);
            }

            // Trigger initial code generation after loading sample
            setTimeout(() => {
              console.log('Triggering initial code generation...');
              handleWorkspaceChange();
            }, 300);
            
          } catch (error) {
            console.error('Failed to initialize Python system:', error);
            // Still add the listener and load sample
            workspace.current.addChangeListener(handleWorkspaceChange);
            
            try {
              const xml = Blockly.utils.xml.textToDom(sampleXml);
              Blockly.Xml.domToWorkspace(xml, workspace.current);
            } catch (sampleError) {
              console.log('Sample program not loaded:', sampleError);
            }
          }
        };

        // Initialize Python generator and listeners
        initializePythonAndListeners();

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
