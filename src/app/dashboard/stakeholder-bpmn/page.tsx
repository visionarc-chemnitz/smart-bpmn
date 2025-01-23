
'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Bpmn } from '@/types/bpmn/bpmn';
import { useUser } from '@/providers/user-provider';
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { useOrganizationWorkspaceContext } from '@/providers/organization-workspace-provider';
import { toastService } from '@/app/services/toast.service';
import BreadcrumbsHeader from '../(components)/breadcrumbs-header';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useRouter } from 'next/router';
import Link from 'next/link';



export default function StakeholderBpmnPage() {
    const [bpmnFiles, setBpmnFiles] = useState<Bpmn[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const user = useUser();
    const { currentProject, currentBpmn, setCurrentBpmn, selectionChanged } = useOrganizationWorkspaceContext();

    useEffect(() => {
        const fetchBpmnFiles = async () => {
            try {
                const response = await fetch(`${API_PATHS.GET_BPMN_FILES}?projectId=${currentProject?.id}`);
                const data = await response.json();
                setBpmnFiles(data.bpmnFiles || []);
                setLoading(false);

                // Automatically select the last file (most recently created)
                if (data.bpmnFiles?.length > 0) {
                    setCurrentBpmn(data.bpmnFiles[data.bpmnFiles.length - 1]);
                } else {
                    setCurrentBpmn(null);
                }
            } catch (error) {
                setError("Error fetching BPMN files");
                setLoading(false);
                toastService.showDestructive("Error fetching BPMN files");
            }
        };
        fetchBpmnFiles();
    
    }, [currentProject, selectionChanged]);

  return (
        <div className="p-4">
          <h3 className="text-md font-semibold">Shared BPMN files with you</h3>

          <Table className='mt-4'>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bpmnFiles.map((bpmn) => (
                <TableRow key={bpmn.id}>
                    <TableCell>{bpmn.fileName}</TableCell>
                    <TableCell>
                    <Link href={`/dashboard/stakeholder-bpmn/${bpmn.currentVersionId}`}>
                    <RainbowButton
                      type="button"
                      className="ml-5 mr-2 py-0 text-sm h-8 px-3"
                      onClick={() => setCurrentBpmn(bpmn)}
                    >
                      View
                    </RainbowButton>
                  </Link>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
};
