import { useEffect, useRef, useState, useCallback } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { 
  BpmnPropertiesPanelModule, 
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import { BpmnModelerProps, BpmnModelerHookResult } from '@/types/board/board-types';
import { useBpmnTheme } from './use-bpmn-theme';
import { debounce } from 'lodash';

interface IOverlays {
  add: (elementId: string, options: {
    position: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    html: string | HTMLElement;
  }) => string;
  remove: (filter: { element?: string }) => void;
  clear: () => void;
}

interface EventBus {
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
}

export const useBpmnModeler = ({
  containerId,
  propertiesPanelId,
  diagramXML,
  onError,
  onImport,
  onChange,
  height = '100%',
  width = '100%',
}: BpmnModelerProps): BpmnModelerHookResult => {
  const [modeler, setModeler] = useState<BpmnModeler | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const propertiesPanelRef = useRef<HTMLElement | null>(null);
  const currentXMLRef = useRef<string>(diagramXML || '');

  useBpmnTheme(modeler);

  // Initialize modeler
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
        BpmnPropertiesProviderModule
      ],
      palette: {
        open: true
      },
      contextPad: {
        open: true
      }
    });

    setModeler(bpmnModeler);

    return () => {
      bpmnModeler.destroy();
    };
  }, [containerId, propertiesPanelId, height, width]);

  // First useEffect - Handle diagram changes
  useEffect(() => {
    if (!modeler) return;

    const eventBus = modeler.get('eventBus') as EventBus;
    const events = [
      'elements.changed',
      'element.changed',
      'shape.added',
      'shape.removed',
      'shape.changed',
      'connection.added',
      'connection.removed',
      'connection.changed',
      'label.added',
      'label.removed',
      'label.changed'
    ];
    
    // comment events
    // 'comments.added',
    // 'comments.removed',
    // 'comments.updated'

    const onChanged = debounce(async () => {
      try {
        const { xml } = await modeler.saveXML({ format: true });
        if (xml !== currentXMLRef.current) {
          currentXMLRef.current = xml as string;
          onChange?.(xml as string);
        }
      } catch (err) {
        console.error('Error saving XML:', err);
      }
    }, 300);

    events.forEach(event => {
      eventBus.on(event, onChanged);
    });

    return () => {
      events.forEach(event => {
        eventBus.off(event, onChanged);
      });
      onChanged.cancel();
    };
  }, [modeler, onChange]);

  // Second useEffect - Handle diagram initialization
  useEffect(() => {
  if (diagramXML && modeler) {
    importXML(diagramXML);
  } else {
    const defaultDiagramXML = `
      <?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
              xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
              xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
              xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
              xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
              xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
              id="sample-diagram"
              targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="false">
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
      </bpmn:definitions>
    `;
    importXML(defaultDiagramXML);
  }
  }, [diagramXML, modeler]);

  // Import XML
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

  // Export XML
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

  // Export SVG
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

  // Add overlay methods
  const addOverlay = (elementId: string, html: string | HTMLElement) => {
    if (!modeler) return;
    const overlays = modeler.get<IOverlays>('overlays');
    overlays.add(elementId, {
      position: {
        bottom: -5,
        left: 0
      },
      html: html
    });
  };

  const removeOverlay = (elementId: string) => {
    if (!modeler) return;
    const overlays = modeler.get<IOverlays>('overlays');
    overlays.remove({ element: elementId });
  };

  // Update clearOverlays function
  const clearOverlay = () => {
    if (!modeler) return;
    try {
      const overlays = modeler.get<IOverlays>('overlays');
      overlays.clear();
    } catch (error) {
      console.error('Error clearing overlays:', error);
    }
  };

  // Update return type to include overlay methods
  return {
    modeler,
    importXML,
    exportXML,
    exportSVG,
    addOverlay,
    removeOverlay,
    clearOverlay
  };
};
