import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const organization = await prisma.organization.findFirst({
      where: {
        ownerEmail: email,
      },
    });

    res.status(200).json({ hasOrganization: organization !== null });
  } catch (error) {
    console.error('Error checking organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}