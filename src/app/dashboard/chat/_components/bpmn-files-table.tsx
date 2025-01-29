import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Bpmn } from '@/types/bpmn/bpmn';
import { Button } from '@/components/ui/button';
import { Check, Heart, X } from 'lucide-react';

interface BpmnFilesTableProps {
  files: Bpmn[];
}

const BpmnFilesTable: React.FC<BpmnFilesTableProps> = ({ files }: BpmnFilesTableProps) => {
  const downloadArc42 = async (threadId: string) => {
    try {
      const response = await fetch('http://localhost:8000/generate-arc42', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ thread_id: threadId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to download Arc42');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `arc42_${threadId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading Arc42:', error);
    }
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            {/* <TableHead>createdBy</TableHead> */}
            {/* <TableHead>Created Date</TableHead> */}
            <TableHead>Shared</TableHead>
            <TableHead>Favourite</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.fileName}</TableCell>
              {/* <TableCell>{file.createdBy}</TableCell> */}
              {/* <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell> */}
                <TableCell>{file.isShared ? <Check className='text-green-600' /> : <X className='text-red-500'/>}</TableCell>
                <TableCell>{file.isFavorite ? <Heart className='text-red-500' /> : <X className='text-red-500'/>}</TableCell>
              <TableCell>
                <div className="flex justify-start gap-2">
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Download BPMN
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadArc42("2d1be027-5642-41f4-84ff-dbca933d223f")}>
                    Download Arc42
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default BpmnFilesTable;
