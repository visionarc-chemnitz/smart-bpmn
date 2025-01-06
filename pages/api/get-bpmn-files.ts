import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { projectId } = req.query;

    if (!projectId || typeof projectId !== 'string') {
        console.error('Invalid project ID:', projectId);
        return res.status(400).json({ error: 'Invalid project ID' });
    }

    try {
        console.log('Fetching BPMN files for project ID:', projectId);
        const bpmnFiles = await prisma.bpmn.findMany({
            where: {
                projectId: projectId,
            },
        });

        if (bpmnFiles.length === 0) {
            console.log('No BPMN files found for project ID:', projectId);
        } else {
            console.log('BPMN files found:', bpmnFiles);
        }

        res.status(200).json({ bpmnFiles });
    } catch (error) {
        console.error('Error fetching BPMN files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}