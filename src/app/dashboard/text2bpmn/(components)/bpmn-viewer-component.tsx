import React from 'react';
import { useBpmnViewer } from '@/hooks/use-bpmn-viewer';
import { BpmnViewerProps } from '@/types/board/board-types';

export  const BpmnViewerComponent =  (props: BpmnViewerProps) => {
  const { containerId, diagramXML, onError, onImport, height, width } = props;
  const { viewer, importXML, exportSVG } = useBpmnViewer({
    containerId,
    diagramXML: diagramXML || '',
    onError,
    onImport,
    height,
    width,
  });

  // Additional component logic and rendering

  return <div id={containerId} style={{ height, width }} />;
};

export default BpmnViewerComponent;