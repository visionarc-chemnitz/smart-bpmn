import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { API_PATHS } from "@/app/api/api-path/apiPath";
import { BpmnVersion } from '@/types/bpmn/bpmnVersion';
import { Bpmn } from '@/types/bpmn/bpmn';
import { Project } from '@/types/project/project';

interface VersionSelectorDropdownProps {
  selectedProject: Project | null;
  selectedFile: Bpmn | null;
  selectedVersion: BpmnVersion | null;
  onSelectProject: (project: Project | null) => void;
  onSelectFile: (file: Bpmn | null) => void;
  onSelectVersion: (version: BpmnVersion | null) => void;
}

export default function VersionSelectorDropdown({
  selectedProject,
  selectedFile,
  selectedVersion,
  onSelectFile,
  onSelectProject,
  onSelectVersion,
}: VersionSelectorDropdownProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<Bpmn[]>([]);
  const [versions, setVersions] = useState<BpmnVersion[]>([]);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const projectDropdownRef = useRef(null);
  const fileDropdownRef = useRef(null);
  const versionDropdownRef = useRef(null);

  useEffect(() => {
    const loadProjects = async () => {
      const response = await fetch(API_PATHS.GET_PROJECTS);
      const data = await response.json();
      setProjects(data.projects);
    };

    loadProjects();
  }, [setProjects]);

  useEffect(() => {
    if (selectedProject) {
      const loadFiles = async () => {
        const response = await fetch(`${API_PATHS.GET_BPMN_FILES}?projectId=${selectedProject.id}`);
        const data = await response.json();
        setFiles(data.bpmnFiles);
      };

      loadFiles();
    } else {
      setFiles([]);
      onSelectFile(null);
      setVersions([]);
      onSelectVersion(null);
    }
  }, [selectedProject, setFiles, onSelectFile, setVersions, onSelectVersion]);

  useEffect(() => {
    if (selectedFile) {
      const loadVersions = async () => {
        const response = await fetch(`${API_PATHS.GET_BPMN_VERSIONS}?bpmnId=${selectedFile.id}`);
        const data = await response.json();
        setVersions(data.bpmnVersions);
      };

      loadVersions();
    } else {
      setVersions([]);
      onSelectVersion(null);
    }
  }, [selectedFile, setVersions, onSelectVersion]);

  const handleProjectChange = (project: Project | null) => {
    onSelectProject(project);
    setIsProjectDropdownOpen(false);
  };

  const handleFileChange = (file: Bpmn | null) => {
    onSelectFile(file);
    setIsFileDropdownOpen(false);
  };

  const handleVersionChange = (version: BpmnVersion | null) => {
    onSelectVersion(version);
    setIsVersionDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent, ref: React.RefObject<HTMLDivElement>, setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      handleClickOutside(event, projectDropdownRef, setIsProjectDropdownOpen);
      handleClickOutside(event, fileDropdownRef, setIsFileDropdownOpen);
      handleClickOutside(event, versionDropdownRef, setIsVersionDropdownOpen);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="dropdown-container" style={{ display: 'flex', gap: '10px' }}>
      <div className="relative" ref={projectDropdownRef}>
        <Label>Project:</Label>
        <button
          onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
          className="flex items-center justify-between w-full min-w-[200px] px-3 py-2 text-sm 
            bg-background border rounded-md shadow-sm hover:bg-accent
            transition-colors duration-200 ease-in-out"
        >
          <span className="truncate">
            {selectedProject?.name || "Select Project"}
          </span>
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 
            ${isProjectDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isProjectDropdownOpen && (
          <div
            className="absolute mt-1 w-full min-w-[200px] bg-popover border rounded-md shadow-lg z-50
          animate-in fade-in-0 zoom-in-95"
          >
            <ScrollArea className="h-[150px] px-2">
              <div className="space-y-1">
                {projects.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    onClick={() => handleProjectChange(project)}
                    className="w-full justify-start gap-2"
                  >
                    {project.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="relative" ref={fileDropdownRef}>
        <Label>File:</Label>
        <button
          onClick={() => setIsFileDropdownOpen(!isFileDropdownOpen)}
          className="flex items-center justify-between w-full min-w-[200px] px-3 py-2 text-sm 
            bg-background border rounded-md shadow-sm hover:bg-accent
            transition-colors duration-200 ease-in-out"
          disabled={!selectedProject}
        >
          <span className="truncate">
            {selectedFile?.fileName || "Select File"}
          </span>
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 
            ${isFileDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isFileDropdownOpen && selectedProject && (
          <div
            className="absolute mt-1 w-full min-w-[200px] bg-popover border rounded-md shadow-lg z-50
          animate-in fade-in-0 zoom-in-95"
          >
            <ScrollArea className="h-[150px] px-2">
              <div className="space-y-1">
                {files.map((file) => (
                  <Button
                    key={file.id}
                    variant="ghost"
                    onClick={() => handleFileChange(file)}
                    className="w-full justify-start gap-2"
                  >
                    {file.fileName}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <div className="relative" ref={versionDropdownRef}>
        <Label>Version:</Label>
        <button
          onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
          className="flex items-center justify-between w-full min-w-[200px] px-3 py-2 text-sm 
            bg-background border rounded-md shadow-sm hover:bg-accent
            transition-colors duration-200 ease-in-out"
          disabled={!selectedFile}
        >
          <span className="truncate">
            {selectedVersion?.versionNumber || "Select Version"}
          </span>
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 
            ${isVersionDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isVersionDropdownOpen && selectedFile && (
          <div
            className="absolute mt-1 w-full min-w-[200px] bg-popover border rounded-md shadow-lg z-50
          animate-in fade-in-0 zoom-in-95"
          >
            <ScrollArea className="h-[150px] px-2">
              <div className="space-y-1">
                {versions.map((version) => (
                  <Button
                    key={version.id}
                    variant="ghost"
                    onClick={() => handleVersionChange(version)}
                    className="w-full justify-start gap-2"
                  >
                    {version.versionNumber}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}