import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Bpmn } from '@/types/bpmn/bpmn';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface BpmnFilesTableProps {
  files: Bpmn[];
}

const BpmnFilesTable: React.FC<BpmnFilesTableProps> = ({ files }: BpmnFilesTableProps) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            {/* <TableHead>createdBy</TableHead> */}
            <TableHead>Created Date</TableHead>
            <TableHead>Shared</TableHead>
            <TableHead>Favourite</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.fileName}</TableCell>
              {/* <TableCell>{file.createdBy}</TableCell> */}
              <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{file.isShared ? <Check /> : <X />}</TableCell>
                <TableCell>{file.isFavorite ? <Check /> : <X />}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    Download BPMN
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {}}>
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
