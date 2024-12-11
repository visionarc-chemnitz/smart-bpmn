"use client";

import { useEffect, useState } from 'react';
import BreadcrumbsHeader from '../(components)/breadcrumbs-header'
import BpmnModelerComponent from './(components)/bpmn-modeler-component';
import { AlertCircle, Download, Cog } from 'lucide-react';
import { apiWrapper } from '@/lib/utils';
import { nanoid } from 'nanoid';

export default function Text2BPMNPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [xml, setXml] = useState<string>('');
  const [error, setError] = useState<string | null>("error is here ");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleError = (error: Error) => {
    console.error('BPMN Error:', error);
    setError(error.message);
  };

  const handleImport = () => {
    console.log('BPMN diagram imported successfully');
  };

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiWrapper(`generate/`, 'POST', { prompt });

      if (!response?.bpmn_xml) throw new Error ("Invalid response!")
      setXml(response.bpmn_xml);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <BreadcrumbsHeader href='/dashboard' current='Text2Bpmn' parent='Playground'/>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Input Section */}
        <div className="rounded-xl bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center">
            <h2 className="text-lg font-semibold">Generate BPMN</h2>
          </div>
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2"
              placeholder="Enter process description..."
            />
            <div className="flex justify-between">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <Cog className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        {/* Output Section */}
        {/* <div className="rounded-xl bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Output</h2>
          {generatedImage ? (
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt="Generated BPMN Diagram"
              className="w-full rounded-md"
            />
          ) : (
            <div className="flex h-[600px] items-center justify-center rounded-md border bg-muted">
              <p className="text-sm text-muted-foreground">
                Generated diagram will appear here
              </p>
            </div>
          )}
        </div> */}

        {/* BPMN Modeler */}
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <BpmnModelerComponent
            containerId="bpmn-modeler"
            propertiesPanelId="properties-panel"
            diagramXML={xml}
            onError={handleError}
            onImport={handleImport}
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </>
  )
}