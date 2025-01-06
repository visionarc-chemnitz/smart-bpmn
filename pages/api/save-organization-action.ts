import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { organizationName, createdBy } = req.body;

    if (!organizationName || !createdBy) {
      return res.status(400).json({ error: 'Organization name and createdBy (user ID) are required' });
    }

    try {
      // Create the organization using createdBy (user ID)
      const organization = await prisma.organization.create({
        data: {
          name: organizationName,
          createdBy: createdBy, // Save the user ID who created the organization
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