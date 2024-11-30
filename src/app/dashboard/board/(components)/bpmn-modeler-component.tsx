import React, { useRef } from 'react';
import { useBpmnModeler } from '@/hooks/use-bpmn-modeler';
import { BpmnModelerProps } from '@/types/board/board-types';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';


export const BpmnModelerComponent = (props: BpmnModelerProps) => {
  const { containerId, propertiesPanelId, diagramXML, onError, onImport, height, width } = props;
  const { modeler, importXML, exportXML, exportSVG } = useBpmnModeler({
    containerId,
    propertiesPanelId,
    diagramXML,
    onError,
    onImport,
    height,
    width,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xml = e.target?.result as string;
        await importXML(xml);
      };
      reader.readAsText(file);
    }
  };

  const handleExportXML = async () => {
    const xml = await exportXML();
    if (xml) {
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.bpmn';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportSVG = async () => {
    const svg = await exportSVG();
    if (svg) {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex w-full h-full">
      {/* Main BPMN container */}
      <div className="relative flex-1">
      <div 
        id={containerId} 
        className="w-full h-full"
        style={{ height: height || '100%', width: width || '100%'}}
      />
      {/* Sticky buttons container */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".bpmn,.xml"
        className="hidden"
        />
        <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-blue-700"
        >
        Import BPMN
        </button>
        <button
        onClick={handleExportXML}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-blue-700"
        >
        Export BPMN
        </button>
        <button
        onClick={handleExportSVG}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-blue-700"
        >
        Export SVG
        </button>
      </div>
      </div>

      {/* Properties panel container */}
      <div 
      id={propertiesPanelId} 
      className="w-[300px] h-full border-l border-gray-200"
      />
    </div>
  );
};

export default BpmnModelerComponent;