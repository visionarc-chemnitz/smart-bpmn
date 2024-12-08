"use client";

import { useEffect, useState, DragEvent } from 'react';
import BreadcrumbsHeader from '../(components)/breadcrumbs-header';
import BpmnModelerComponent from '../text2bpmn/(components)/bpmn-modeler-component';
import { AlertCircle, Image as ImageIcon, Cog } from 'lucide-react';
import { UploadSection } from './(components)/upload-section';
import { Button } from '@/components/ui/button';

export default function Image2BPMNPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [xml, setXml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Cleanup preview URL on unmount
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  // Clear error message after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Convert image to BPMN using the v1/convert API
  const convertImageToBPMN = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('elements', 'true');
      formData.append('flows', 'true');
      formData.append('ocr', 'true');

      const response = await fetch('https://eshwarik-image2bpmn.hf.space/api/v1/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert image');
      }

      const data = await response.text();
      setXml(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  // Handle file drop event
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer) return;
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length) {
      setSelectedFile(imageFiles[0]);
    }
  };

  // Handle file select event
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  // Handle back button click
  const handleBackButton = () => {
    setSelectedFile(null);
    setXml('');
    setImagePreview(null);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <BreadcrumbsHeader href='/dashboard' current='Image2BPMN' parent='Playground'/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">

          { xml && imagePreview && (
            <div className="flex justify-end">
              <Button
              onClick={handleBackButton}
              className="shadow-sm transition-all duration-200 hover:shadow-md"
              variant={'default'}
              >
              Clear
              </Button>
            </div>
          )}

          {/* Upload Section */}
          { !xml &&
            <UploadSection 
              onFileSelect={handleFileSelect}
              onDrop={handleDrop}
              selectedFile={selectedFile} 
              isLoading={loading}
            />
          }


          {/* Error Message */} 
          {error && (
            <div className="animate-slideIn">
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 shadow-sm">
                <div className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            </div>
          )}

          {selectedFile && imagePreview && (
            <div className="mt-4">
              <div id="imagePreview" className="flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-[400px] object-contain rounded-lg"
                />
              </div>
              <button
                onClick={() => convertImageToBPMN(selectedFile)}
                disabled={loading}
                className={`mt-4 inline-flex items-center px-8 py-3 rounded-full text-white font-medium
                transition-all duration-200 transform hover:scale-105
                ${loading 
                  ? 'bg-primary/80 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 hover:shadow-lg'
                }
                `}
              >
                {loading ? (
                <Cog className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                <ImageIcon className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Converting...' : 'Convert to BPMN'}
              </button>
            </div>
          )}

          {xml && (
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-all duration-300">
              <div className="h-[calc(100vh-24rem)] md:h-[800px]">
                <BpmnModelerComponent
                  containerId="bpmn-modeler"
                  propertiesPanelId="properties-panel"
                  diagramXML={xml}
                  onError={(error: Error) => setError(error.message)}
                  onImport={() => console.log('BPMN diagram imported successfully')}
                  height="100%"
                  width="100%"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
