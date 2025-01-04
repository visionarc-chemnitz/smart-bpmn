import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    console.error('Invalid email:', email);
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    console.log('Fetching organizations for email:', email);
    const organizations = await prisma.organization.findMany({
      where: {
        ownerEmail: email,
      },
    });

    if (organizations.length === 0) {
      console.log('No organizations found for email:', email);
    } else {
      console.log('Organizations found:', organizations);
    }

    res.status(200).json({ organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}