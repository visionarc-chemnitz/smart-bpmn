import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { organizationName, ownerName, ownerEmail } = req.body;

    if (!organizationName || !ownerName || !ownerEmail) {
      return res.status(400).json({ error: 'Organization name, owner name, and owner email are required' });
    }

    try {
      // Create the organization using ownerName and ownerEmail
      const organization = await prisma.organization.create({
        data: {
          name: organizationName,
          ownerName: ownerName,    // Save the owner's name
          ownerEmail: ownerEmail,  // Save the owner's email
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
