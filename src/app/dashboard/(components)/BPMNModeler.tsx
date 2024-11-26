import React, { useEffect, useRef } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

interface BPMNModelerProps {
  // Add any props you need
  onSave?: (xml: string) => void;
}

const BPMNModeler: React.FC<BPMNModelerProps> = ({ onSave }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the BPMN modeler
    const modeler = new BpmnModeler({
      container: containerRef.current
    });
    modelerRef.current = modeler;

    // Load an empty BPMN diagram or existing one
    const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
        xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
        id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
        <bpmn:process id="Process_1" isExecutable="false">
          <bpmn:startEvent id="StartEvent_1"/>
        </bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
            <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
              <dc:Bounds x="152" y="102" width="36" height="36"/>
            </bpmndi:BPMNShape>
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>`;

    modeler.importXML(emptyBpmn).catch((err: Error) => {
      console.error('Error loading BPMN diagram', err);
    });

    // Cleanup
    return () => {
      modeler.destroy();
    };
  }, []);

  const handleSave = async (): Promise<void> => {
    if (!modelerRef.current) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      onSave?.(xml || '');
    } catch (err) {
      console.error('Error saving BPMN diagram', err);
    }
  };

  const loadDiagram = (xmlString: string): void => {
    if (!modelerRef.current) return;

    modelerRef.current.importXML(xmlString).catch((err: Error) => {
      console.error('Error loading BPMN diagram', err);
    });
  };

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100vh', 
        border: '1px solid #ccc' 
      }} 
    />
  );
};

export default BPMNModeler; 