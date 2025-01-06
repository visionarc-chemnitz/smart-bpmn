import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    fileName,
    projectId,
    createdBy,
    isFavorite,
    isShared,
  } = req.body;

  if (!fileName || !createdBy) {
    console.error('Missing required fields:', {
      fileName,
      createdBy,
    });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the projectId exists
    if (projectId) {
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!projectExists) {
        console.error('Project ID does not exist:', projectId);
        return res.status(400).json({ error: 'Project ID does not exist' });
      }
    }

    const bpmnFile = await prisma.bpmn.create({
      data: {
        fileName,
        projectId,
        createdBy,
        isFavorite,
        isShared,
      },
    });

    console.log('BPMN file created:', bpmnFile);
    res.status(201).json(bpmnFile);
  } catch (error) {
    console.error('Error saving BPMN file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}