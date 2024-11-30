import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import { useEffect, useRef } from 'react';
import {BpmnViewerProps, BpmnViewerHookResult} from '@/types/board/board-types';

/**
 * A custom React hook for rendering and managing BPMN diagrams using bpmn-js viewer.
 * 
 * @param {BpmnViewerProps} props - The props object containing configuration for the BPMN viewer
 * @param {string} props.diagramXML - The BPMN 2.0 XML string to be rendered
 * @param {string} props.containerId - The ID of the DOM element where the diagram will be rendered
 * @param {function} [props.onError] - Optional callback function that is called when an error occurs during import
 * @param {function} [props.onImport] - Optional callback function that is called after successful diagram import
 * @param {string|number} [props.height='100%'] - Height of the viewer container. Can be number (px) or string CSS value
 * @param {string|number} [props.width='100%'] - Width of the viewer container. Can be number (px) or string CSS value
 * 
 * @returns {BpmnViewerHookResult} An object containing:
 *   - viewer: The bpmn-js viewer instance
 *   - importXML: Function to import new BPMN XML
 *   - exportSVG: Function to export the diagram as SVG
 * 
 * @example
 * const { viewer, importXML, exportSVG } = useBpmnViewer({
 *   diagramXML: myBpmnXml,
 *   containerId: 'bpmn-container',
 *   onError: (err) => console.error(err),
 *   height: 600,
 *   width: '100%'
 * });
 */
export function useBpmnViewer({ diagramXML, containerId, onError, onImport, height = '100%', width = '100%' }: BpmnViewerProps): BpmnViewerHookResult {
  const containerRef = useRef<HTMLElement | null>(null);
  const viewerRef = useRef<BpmnViewer | null>(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    containerRef.current = container;
    container.style.height = typeof height === 'number' ? `${height}px` : height;
    container.style.width = typeof width === 'number' ? `${width}px` : width;

    const viewer = new BpmnViewer({
      container,
    });

    viewerRef.current = viewer;

    const importDiagram = async () => {
      try {
        await viewer.importXML(diagramXML);
        const canvas = viewer.get<any>('canvas');
        canvas.zoom('fit-viewport');
        onImport?.();
      } catch (err) {
        onError?.(err as Error);
      }
    };

    importDiagram();

    return () => {
      viewer.destroy();
    };
  }, [diagramXML, containerId, height, width, onError, onImport]);

  return {
    viewer: viewerRef.current,
    importXML: (xml: string) => viewerRef.current?.importXML(xml),
    exportSVG: () => viewerRef.current?.saveSVG(),
  };
}