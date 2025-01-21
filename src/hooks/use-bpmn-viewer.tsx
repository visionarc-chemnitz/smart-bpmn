import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import { useEffect, useRef, useState } from 'react';
import {BpmnViewerProps, BpmnViewerHookResult} from '@/types/board/board-types';
import { useBpmnTheme } from './use-bpmn-theme';
//import EmbeddedComments from 'bpmn-js-embedded-comments';

interface IOverlays {
  add: (elementId: string, options: {
    position: { top?: number; right?: number; bottom?: number; left?: number; };
    html: string | HTMLElement;
  }) => string;
  clear: () => void;
}

export function useBpmnViewer({ 
  containerId,
  diagramXML,
  onError,
  onImport,
  height = '100%',
  width = '100%'
}: BpmnViewerProps): BpmnViewerHookResult {
  const viewerRef = useRef<BpmnViewer | null>(null);
  
  useBpmnTheme(viewerRef.current);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.height = typeof height === 'number' ? `${height}px` : height;
    container.style.width = typeof width === 'number' ? `${width}px` : width;

    const bpmnViewer = new BpmnViewer({
      container,
    });

    viewerRef.current = bpmnViewer;

    return () => {
      bpmnViewer.destroy();
      viewerRef.current = null;
    };
  }, [containerId, height, width]);

  
  const viewer = viewerRef.current;
  useEffect(() => {
  if (diagramXML && viewer) {
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
  }, [diagramXML, viewer]);

  const importXML = async (xml: string) => {
    if (!viewer) return;

    try {
      console.log(xml)
      await viewer.importXML(xml);
      const canvas = viewer.get('canvas') as { zoom: (type: string) => void };
      canvas.zoom('fit-viewport');
      onImport?.();
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const exportXML = async (): Promise<string> => {
    if (!viewer) return '';

    try {
      const { xml } = await viewer.saveXML({ format: true });
      return xml as string;
    } catch (err) {
      onError?.(err as Error);
      return '';
    }
  };

  const addOverlay = (elementId: string, html: string | HTMLElement) => {
    if (!viewer) return;
    const overlays = viewer.get<IOverlays>('overlays');
    overlays.add(elementId, {
      position: {
        top: 5,
        right: 5
      },
      html: html
    });
  };

  const clearOverlay = () => {
    if (!viewer) return;
    try {
      const overlays = viewer.get<IOverlays>('overlays');
      overlays.clear();
    } catch (error) {
      console.error('Error clearing overlays:', error);
    }
  };

  return {
    viewer,
    importXML,
    exportXML,
    exportSVG: () => viewer?.saveSVG(),
    addOverlay,
    clearOverlay
  };
}