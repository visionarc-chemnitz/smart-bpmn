"use client";

import React, { useEffect, useState } from "react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { FileText, ChevronRight, Loader } from "lucide-react";
import { API_PATHS } from '@/app/api/api-path/apiPath';

interface BpmnFile {
    id: string;
    fileName: string;
    url: string;
}

interface NavBpmnFileProps {
    projectId: string;
}

export function NavBpmnFile({ projectId }: NavBpmnFileProps) {
    const [bpmnFiles, setBpmnFiles] = useState<BpmnFile[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null); // Track selected file
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBpmnFiles = async () => {
            try {
                const response = await fetch(`${API_PATHS.GET_BPMN_FILES}?projectId=${projectId}`);
                const data = await response.json();
                setBpmnFiles(data.bpmnFiles || []);
                setLoading(false);

                // Automatically select the first file if none is selected
                if (data.bpmnFiles?.length > 0 && !selectedFileId) {
                    setSelectedFileId(data.bpmnFiles[0].id);
                }
            } catch (error) {
                setError("Error fetching BPMN files");
                setLoading(false);
            }
        };

        fetchBpmnFiles();
    }, [projectId, selectedFileId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader className="animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>History</SidebarGroupLabel>
            <SidebarMenu>
                {bpmnFiles.length === 0 ? (
                    <SidebarMenuItem className="flex items-center p-2 rounded-md">
                        <FileText className="text-gray-500 mr-2" />
                        <span className="text-gray-500">No files available</span>
                    </SidebarMenuItem>
                ) : (
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton>
                                    <FileText className="mr-2" />
                                    <span className="flex-1">BPMN Files</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {bpmnFiles.map((file) => (
                                        <SidebarMenuSubItem
                                            key={file.id}
                                            className={`hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${
                                                selectedFileId === file.id ? "bg-blue-100 dark:bg-blue-800" : ""
                                            }`}
                                            onClick={() => setSelectedFileId(file.id)}
                                        >
                                            <SidebarMenuSubButton asChild>
                                                <a
                                                    href={file.url}
                                                    className="flex-1 text-blue-500 hover:no-underline cursor-pointer"
                                                    aria-current={selectedFileId === file.id ? "true" : "false"}
                                                >
                                                    {file.fileName}
                                                </a>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}