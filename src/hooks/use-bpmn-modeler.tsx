import { useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { 
  BpmnPropertiesPanelModule, 
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import { BpmnModelerProps, BpmnModelerHookResult } from '@/types/board/board-types';
import { useBpmnTheme } from './use-bpmn-theme';

export const useBpmnModeler = ({
  containerId,
  propertiesPanelId,
  diagramXML,
  onError,
  onImport,
  height = '100%',
  width = '100%',
}: BpmnModelerProps): BpmnModelerHookResult => {
  const [modeler, setModeler] = useState<BpmnModeler | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const propertiesPanelRef = useRef<HTMLElement | null>(null);

  const defaultDiagramXML = `
    <?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                      xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                      xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                      xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
                      id="sample-diagram"
                      targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn2:process id="Process_1" isExecutable="false">
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn2:definitions>
  `;

  useBpmnTheme(modeler);

  useEffect(() => {
    const container = document.getElementById(containerId);
    const propertiesPanel = document.getElementById(propertiesPanelId);
    if (!container) return;

    containerRef.current = container;
    propertiesPanelRef.current = propertiesPanel;
    container.style.height = typeof height === 'number' ? `${height}px` : height;
    container.style.width = typeof width === 'number' ? `${width}px` : width;

    const bpmnModeler = new BpmnModeler({
      container,
      propertiesPanel: {
        parent: propertiesPanel
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ],
      palette: {
        open: true
      },
      contextPad: {
        open: true
      }
    });

    // Initialize with default or provided XML
    const xmlToLoad = diagramXML || defaultDiagramXML;
    bpmnModeler.importXML(xmlToLoad)
      .then(() => {
        const canvas = bpmnModeler.get('canvas') as { zoom: (type: string) => void };
        canvas.zoom('fit-viewport');   
        onImport?.();
      })
      .catch((err) => {
        onError?.(err as Error);
      });
    // if (diagramXML) {
    //   bpmnModeler.importXML(diagramXML)
    //     .then(() => {
    //       const canvas = bpmnModeler.get('canvas') as { zoom: (type: string) => void };
    //       canvas.zoom('fit-viewport');
    //       onImport?.();
    //     })
    //     .catch((err) => {
    //       onError?.(err as Error);
    //     });
    // }

    setModeler(bpmnModeler);

    return () => {
      bpmnModeler.destroy();
    };
  }, [containerId, height, width, diagramXML]);

  const importXML = async (xml: string) => {
    if (!modeler) return;

    try {
      await modeler.importXML(xml);
      const canvas = modeler.get('canvas') as { zoom: (type: string) => void };
      canvas.zoom('fit-viewport');
      onImport?.();
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const exportXML = async (): Promise<string> => {
    if (!modeler) return '';

    try {
      const { xml } = await modeler.saveXML({ format: true });
      return xml as string;
    } catch (err) {
      onError?.(err as Error);
      return '';
    }
  };

  const exportSVG = async (): Promise<string> => {
    if (!modeler) return '';

    try {
      const { svg } = await modeler.saveSVG();
      return svg;
    } catch (err) {
      onError?.(err as Error);
      return '';
    }
  };

  return {
    modeler,
    importXML,
    exportXML,
    exportSVG,
  };
};