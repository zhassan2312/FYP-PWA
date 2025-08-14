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
      // Generate Python code
      const code = generatePythonCode(workspace.current);
      onCodeChangeRef.current?.(code);

      // Generate robot commands for WebSocket communication
      const commands = generateRobotCommands(workspace.current);
      onProgramChangeRef.current?.(commands);
    } catch (error) {
      onCodeChangeRef.current?.('// Error generating code. Please check console for details.');
      onProgramChangeRef.current?.([]);
    }
  }, []); // Empty dependency array since we use refs

  useEffect(() => {
    if (blocklyDiv.current && !isInitialized) {
      try {
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
          scrollbars: {
            horizontal: true,
            vertical: true
          },
          renderer: 'geras',
          move: {
            scrollbars: {
              horizontal: true,
              vertical: true
            },
            drag: true,
            wheel: true
          }
        });

        workspace.current = ws;
        setIsInitialized(true);

        // Inject custom CSS to fix scrollbar issues
        const style = document.createElement('style');
        style.textContent = `
          .blocklyDiv {
            overflow: hidden !important;
            width: 100% !important;
            height: 100% !important;
          }
          .blocklyWidgetDiv {
            z-index: 999;
          }
          .blocklyToolboxDiv {
            overflow: auto !important;
          }
          .blocklyMainBackground {
            overflow: hidden !important;
          }
        `;
        if (!document.querySelector('#blockly-custom-styles')) {
          style.id = 'blockly-custom-styles';
          document.head.appendChild(style);
        }

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

            // Force initial resize and cleanup scrollbars
            setTimeout(() => {
              if (workspace.current && blocklyDiv.current) {
                Blockly.svgResize(workspace.current);
                // Clear any residual scrollbars and ensure proper container sizing
                const blocklyDiv = workspace.current.getParentSvg().parentElement;
                if (blocklyDiv) {
                  blocklyDiv.style.overflow = 'hidden';
                  blocklyDiv.style.width = '100%';
                  blocklyDiv.style.height = '100%';
                }
              }
            }, 100);

            // Trigger initial code generation
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

  // Handle window resize and container resize
  useEffect(() => {
    const handleResize = () => {
      if (workspace.current && blocklyDiv.current) {
        // Force a timeout to ensure DOM is settled
        setTimeout(() => {
          try {
            Blockly.svgResize(workspace.current);
            // Clear any persistent scrollbars by refreshing the workspace
            workspace.current.refreshToolboxSelection();
          } catch (error) {
            console.warn('Error during resize:', error);
          }
        }, 100);
      }
    };

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Handle container resize using ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    if (blocklyDiv.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === blocklyDiv.current) {
            handleResize();
          }
        }
      });
      resizeObserver.observe(blocklyDiv.current);
    }

    // Initial resize
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isInitialized]);

  return (
    <div 
      ref={blocklyDiv} 
      className="w-full h-full overflow-hidden"
      style={{ 
        minHeight: '100%',
        height: '100%',
        position: 'relative'
      }}
    />
  );
}

export default BlocklyWorkspaceInner;
