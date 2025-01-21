"use client";

import React, { useState, useRef } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { BpmnViewerComponent } from '../text2bpmn/(components)/bpmn-viewer-component';
import BreadcrumbsHeader from '../(components)/breadcrumbs-header';
import { diff } from 'bpmn-js-differ';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import type { BpmnViewerRef } from '@/types/board/board-types';
import DifferencesTable from './(components)/differences-table';

interface ProcessedDiff {
  type: string;
  elementId: string;
  elementType: string;
  changes?: any;
}

interface BpmnDiff {
  _changed: {
    [key: string]: {
      model: { $type: string; id: string };
      attrs: { [key: string]: { oldValue: string; newValue: string } };
    };
  };
  _added: { [key: string]: { $type: string; id: string } };
  _removed: { [key: string]: { $type: string; id: string } };
  _layoutChanged: { [key: string]: { $type: string; id: string } };
}

export default function DiffCheckerPage() {
  const [difference, setDifference] = useState(null);
  const [xml1, setXml1] = useState('');
  const [xml2, setXml2] = useState('');

  const modeler1Ref = useRef<BpmnViewerRef>(null);
  const modeler2Ref = useRef<BpmnViewerRef>(null);

  const compareDiagrams = async (originalXml: string, changedXml: string) => {
    if (!originalXml || !changedXml) {
      throw new Error('Both original and changed XML are required');
    }

    try {
      const viewer1 = new BpmnViewer();
      const viewer2 = new BpmnViewer();

      // Import XMLs and wait for both to complete
      const [importResult1, importResult2] = await Promise.all([
        viewer1.importXML(originalXml),
        viewer2.importXML(changedXml)
      ]);

      if (importResult1.warnings.length || importResult2.warnings.length) {
        console.warn('Import warnings:', {
          original: importResult1.warnings,
          changed: importResult2.warnings
        });
      }

      // Get the root elements
      const definitions1 = viewer1.getDefinitions();
      const definitions2 = viewer2.getDefinitions();

      // Perform diff using bpmn-js-differ
      const difference = diff(definitions1, definitions2);
      console.log('Difference:', difference);
      // Cleanup
      viewer1.destroy();
      viewer2.destroy();

      return difference;
    } catch (error) {
      console.error('Error in diagram comparison:', error);
      throw error;
    }
  };

  const handleImport1 = async () => {
    if (!modeler1Ref.current) {
      throw new Error('Modeler1 is not initialized');
    }
    const xml = await modeler1Ref.current.exportXML();
    setXml1(xml);
    handleCompareDiagrams(xml, xml2);
  };

  const handleImport2 = async () => {
    if (!modeler2Ref.current) {
      throw new Error('Modeler2 is not initialized');
    }
    const xml = await modeler2Ref.current.exportXML();
    setXml2(xml);
    handleCompareDiagrams(xml1, xml);
  };

  const handleCompareDiagrams = async (xml1: string, xml2: string) => {
    try {
      if (xml1 && xml2) {
        const differences = await compareDiagrams(xml1, xml2);
        setDifference(differences);
        console.table(extractChanges(differences));
        addOverlays(differences, modeler1Ref, modeler2Ref);
      }
    } catch (error) {
      console.error('Error comparing diagrams:', error);
    }
  };

  const extractChanges = (differences: any) => {
    const markerSymbols = {
      'element-removed': '−',
      'element-added': '+',
      'layout-changed': '⇨',
      'element-modified': '✎'
    };
    const result: { id: string; type: string; name?: string; change: string; markerType: string; marker: string}[] = [];
  
    // Handle _changed
    for (const key in differences._changed) {
      const { model, attrs } = differences._changed[key];
      result.push({
        id: key,
        type: model.$type,
        name: attrs.name ? attrs.name.newValue : undefined,
        change: 'Element Modified',
        markerType: 'element-modified',
        marker: markerSymbols['element-modified']
      });
    }
  
    // Handle _removed
    for (const key in differences._removed) {
      const { $type } = differences._removed[key];
      result.push({
        id: key,
        type: $type,
        name: undefined,
        change: 'Element Removed',
        markerType: 'element-removed',
        marker: markerSymbols['element-removed']
      });
    }
  
    // Handle _layoutChanged
    for (const key in differences._layoutChanged) {
      const { $type } = differences._layoutChanged[key];
      result.push({
        id: key,
        type: $type,
        name: undefined,
        change: 'Layout Changed',
        markerType: 'layout-changed',
        marker: markerSymbols['layout-changed']
      });
    }
  
    // Handle _added
    for (const key in differences._added) {
      const { $type } = differences._added[key];
      result.push({
        id: key,
        type: $type,
        name: undefined,
        change: 'Element Added',
        markerType: 'element-added',
        marker: markerSymbols['element-added']
      });
    }
  
    return result;
  };

  const processDifferences = (differences: BpmnDiff) => {
    const result: { type: string; elementId: string; elementType: string; changes?: any }[] = [];
  
    // Process added elements
    Object.entries(differences._added).forEach(([id, details]) => {
      result.push({
        type: 'element-added',
        elementId: id,
        elementType: details.$type
      });
    });
  
    // Process removed elements
    Object.entries(differences._removed).forEach(([id, details]) => {
      result.push({
        type: 'element-removed',
        elementId: id,
        elementType: details.$type
      });
    });
  
    // Process changed elements
    Object.entries(differences._changed).forEach(([id, details]) => {
      result.push({
        type: 'element-modified',
        elementId: id,
        elementType: details.model.$type,
        changes: details.attrs
      });
    });
  
    // Process layout changes
    Object.entries(differences._layoutChanged).forEach(([id, details]) => {
      result.push({
        type: 'layout-changed',
        elementId: id,
        elementType: details.$type
      });
    });
  
    return result;
  };
  
  // Helper function to generate overlay HTML
  const generateOverlayHtml = (diff: ProcessedDiff) => {
    const markerDiv = document.createElement('div');
    markerDiv.className = 'marker-container';
    
    const markers = {
      'element-removed': '&minus;',
      'element-added': '&#43;',
      'layout-changed': '&#8680;',
      'element-modified': '&#9998;'
    };

    const marker = markers[diff.type as keyof typeof markers] || '&#9998;';
    markerDiv.innerHTML = `<div class="marker marker-${diff.type}">${marker}</div>`;
  
    return markerDiv;
  };

  const addOverlays = (
    differences: BpmnDiff, 
    modeler1Ref: React.RefObject<BpmnViewerRef>,
    modeler2Ref: React.RefObject<BpmnViewerRef>
  ) => {
    if (!modeler1Ref.current || !modeler2Ref.current) return;
    clearOverlays();
    const processedDiffs = processDifferences(differences);
    
    processedDiffs.forEach((diff) => {
      const overlayHtml1 = generateOverlayHtml(diff);
      const overlayHtml2 = generateOverlayHtml(diff);
      
      switch (diff.type) {
        case 'element-added':
          modeler2Ref.current?.addOverlay(diff.elementId, overlayHtml2);
          break;
        case 'element-removed':
          modeler1Ref.current?.addOverlay(diff.elementId, overlayHtml1);
          break;
        case 'layout-changed':
        case 'element-modified':
          modeler1Ref.current?.addOverlay(diff.elementId, overlayHtml1);
          modeler2Ref.current?.addOverlay(diff.elementId, overlayHtml2);
          break;
      }
    });
  };

  const clearOverlays = () => {
    try {
      modeler1Ref.current?.clearOverlay()
      modeler2Ref.current?.clearOverlay()
    } catch (error) {
      console.error('Failed to clear overlays:', error);
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <BreadcrumbsHeader href='/dashboard' current='Diff-Checker' parent='Playground' />
      <div style={{ height: '85%', width: '100%' }}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>
            <div style={{ width: '100%', height: '100%' }}>
              <BpmnViewerComponent
                ref={modeler1Ref}
                containerId="bpmn-container-1"
                diagramXML=""
                onError={(err) => console.error(err)}
                onImport={handleImport1}
                height="100%"
                width="100%"
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div style={{ width: '100%', height: '100%' }}>
              <BpmnViewerComponent
                ref={modeler2Ref}
                containerId="bpmn-container-2"
                diagramXML=""
                onError={(err) => console.error(err)}
                onImport={handleImport2}
                height="100%"
                width="100%"
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {difference && (
        <div className="p-4">
          <h3 className="text-md font-semibold">Differences:</h3>
          <DifferencesTable differences={extractChanges(difference)} />
        </div>
      )}
      {/* <footer className="p-2 bg-gray-100 dark:bg-gray-800" style={{ maxWidth: 'var(--sidebar-footer-width)' }}>
        <button
          onClick={clearOverlays}
          className="m-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
        >
          Clear Overlays
        </button>
      </footer> */}
    </div>
  );
}