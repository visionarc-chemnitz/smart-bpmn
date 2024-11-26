"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

export default function ImageToBPMNPage() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      // TODO: Handle the image processing here
      console.log('Processing image:', file);
    } else {
      alert('Please upload an image file');
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50">
        <div
          className={`relative h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors
            ${dragActive ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          
          <div className="flex flex-col items-center gap-4 text-center p-8">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary/50" />
            </div>
            <div>
              <p className="text-xl font-medium">Upload an image</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to upload
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 