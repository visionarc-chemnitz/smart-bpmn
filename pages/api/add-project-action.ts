import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { projectName, organizationId, createdBy } = req.body;

    if (!projectName || !organizationId || !createdBy) {
      return res.status(400).json({ error: 'Project name, Organization ID, and createdBy are required' });
    }

    try {
      // Create a project using organizationId and createdBy
      const project = await prisma.project.create({
        data: {
          name: projectName,
          organizationId: organizationId, // Link project to the organization
          createdBy: createdBy,  // Save the creator's ID
        },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);

      if ((error as any).code === 'P2003') {
        return res.status(400).json({ error: 'Invalid organizationId. Organization does not exist.' });
      }

      res.status(500).json({ error: 'Error creating project' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}