import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    console.error('Invalid user ID:', userId);
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    console.log('Checking organization for user ID:', userId);
    const organization = await prisma.organization.findFirst({
      where: {
        createdBy: userId,
      },
    });

    res.status(200).json({ hasOrganization: organization !== null });
  } catch (error) {
    console.error('Error checking organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}