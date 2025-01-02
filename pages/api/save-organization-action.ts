import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { organizationName, ownerId } = req.body;

    if (!organizationName || !ownerId) {
      return res.status(400).json({ error: 'Name and ownerId are required' });
    }

    try {
      const organization = await prisma.organization.create({
        data: {
          name: organizationName,
          ownerId: ownerId,
        },
      });
      res.status(200).json(organization);
    } catch (error) {
      console.error('Error creating organization:', error);
      res.status(500).json({ error: 'Error creating organization' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}