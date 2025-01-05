import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    console.error('Invalid email:', email);
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    console.log('Fetching projects for email:', email);
    const projects = await prisma.project.findMany({
      where: {
        ownerEmail: email,
      },
    });

    if (projects.length === 0) {
      console.log('No projects found for email:', email);
    } else {
      console.log('Projects found:', projects);
    }

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}