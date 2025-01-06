import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    console.error('Invalid user ID:', userId);
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    console.log('Fetching organization for user ID:', userId);
    const organization = await prisma.organization.findFirst({
      where: {
        createdBy: userId,
      },
    });

    if (!organization) {
      console.log('No organization found for user ID:', userId);
      return res.status(404).json({ error: 'No organization found' });
    } else {
      console.log('Organization found:', organization);
    }

    res.status(200).json({ organization });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}