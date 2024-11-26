import React, { useEffect, useRef } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { useTheme } from 'next-themes';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

interface BPMNModelerProps {
  onSave?: (xml: string) => void;
}

const BPMNModeler: React.FC<BPMNModelerProps> = ({ onSave }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const { theme } = useTheme();
  const viewboxRef = useRef<any>(null);

  const getThemeColors = () => {
    return theme === 'dark' 
      ? {
          textRenderer: {
            defaultStyle: {
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px',
              color: '#ffffff'
            }
          },
          bpmnRenderer: {
            defaultFillColor: '#2a2a2a',
            defaultStrokeColor: '#ffffff',
            defaultLabelColor: '#ffffff'
          },
          canvas: {
            fill: '#1a1a1a'
          },
          elementColors: {
            fill: '#2a2a2a',
            stroke: '#ffffff'
          }
        }
      : {
          textRenderer: {
            defaultStyle: {
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px',
              color: '#000000'
            }
          },
          bpmnRenderer: {
            defaultFillColor: '#ffffff',
            defaultStrokeColor: '#000000',
            defaultLabelColor: '#000000'
          },
          canvas: {
            fill: '#ffffff'
          },
          elementColors: {
            fill: '#ffffff',
            stroke: '#000000'
          }
        };
  };

  const initializeModeler = () => {
    if (!containerRef.current) return;

    // Store the current viewbox if modeler exists
    if (modelerRef.current) {
      try {
        const canvas = (modelerRef.current as any).get('canvas');
        viewboxRef.current = canvas.viewbox();
        modelerRef.current.destroy();
      } catch (error) {
        console.error('Error saving viewbox:', error);
      }
    }

    // Create new modeler with theme configuration
    const modeler = new BpmnModeler({
      container: containerRef.current,
      ...getThemeColors()
    });

    modelerRef.current = modeler;
    // Import the BPMN diagram
    modeler.importXML(`<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  id="Definitions_1"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`)
      .then(() => {
        // Restore viewbox if it exists
        if (viewboxRef.current) {
          try {
            const canvas = (modelerRef.current as any).get('canvas');
            canvas.viewbox(viewboxRef.current);
          } catch (error) {
            console.error('Error restoring viewbox:', error);
          }
        }

        // Apply theme colors to all existing elements
        const elementRegistry = (modelerRef.current as any).get('elementRegistry');
        const modeling = (modelerRef.current as any).get('modeling');
        
        elementRegistry.getAll().forEach((element: any) => {
          if (element.type !== 'label') {
            modeling.setColor(element, {
              fill: getThemeColors().bpmnRenderer.defaultFillColor,
              stroke: getThemeColors().bpmnRenderer.defaultStrokeColor
            });
          }
        });
      })
      .catch((err: Error) => {
        console.error('Error loading BPMN diagram', err);
      });
  };

  useEffect(() => {
    initializeModeler();

    return () => {
      if (modelerRef.current) {
        modelerRef.current.destroy();
      }
    };
  }, [theme]); // Reinitialize when theme changes

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[600px] border border-border rounded-lg"
    />
  );
};

export default BPMNModeler; 