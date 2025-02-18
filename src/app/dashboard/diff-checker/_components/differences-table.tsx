import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface Difference {
  id: string;
  type: string;
  name?: string;
  change: string;
  marker: string;
  markerType: string;
}

interface DifferencesTableProps {
  differences: Difference[];
}

const DifferencesTable: React.FC<DifferencesTableProps> = ({ differences }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Marker</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {differences.map((diff) => (
          <TableRow key={diff.id}>
            <TableCell>{diff.id}</TableCell>
            <TableCell>{diff.type}</TableCell>
            <TableCell>{diff.name || 'N/A'}</TableCell>
            <TableCell>{diff.change}</TableCell>
            <TableCell>
              <div className={`marker marker-${diff.markerType}`}>
                {diff.marker}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DifferencesTable;