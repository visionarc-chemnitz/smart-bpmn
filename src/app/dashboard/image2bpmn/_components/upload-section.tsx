import { ImageIcon, Upload } from "lucide-react";
import { UploadSectionProps } from "@/types/board/board-types";

export const UploadSection = ({ onFileSelect, onDrop, selectedFile, isLoading }: UploadSectionProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div className="relative" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="flex flex-col items-center justify-center p-12 space-y-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl m-4">
        <div className="p-6 bg-primary/10 dark:bg-primary/5 rounded-full">
          <Upload className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedFile ? selectedFile.name : "Drop your image here"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedFile ? "File selected" : "or click to browse from your computer"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-16 bg-gray-200 dark:bg-gray-600"></span>
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Supported formats: PNG, JPG, JPEG</span>
          <span className="h-[1px] w-16 bg-gray-200 dark:bg-gray-600"></span>
        </div>
        <button
          disabled={isLoading}
          className={`inline-flex items-center px-8 py-3 rounded-full bg-primary text-white shadow-lg transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
            isLoading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
          }`}
          onClick={() => {
            if (isLoading) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.multiple = false;
            input.onchange = (e) => {
              const selectedFile = (e.target as HTMLInputElement).files?.[0];
              if (selectedFile) {
          onFileSelect(selectedFile);
              }
            };
            input.click();
          }}
          onDrop={(e) => {
            if (isLoading) return;
            e.preventDefault();
            const file = e.dataTransfer?.files[0];
            if (file) {
              onFileSelect(file);
            }
          }}
        >
          <ImageIcon className="w-5 h-5 mr-2 animate-pulse" />
          <span className="text-sm font-medium tracking-wide">
            {selectedFile ? "Change File" : "Choose File"}
          </span>
        </button>
      </div>
    </div>
  </div>
);