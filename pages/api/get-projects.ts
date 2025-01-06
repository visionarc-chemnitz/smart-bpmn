import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        console.error('Invalid user ID:', userId);
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        console.log('Fetching projects for user ID:', userId);
        const projects = await prisma.project.findMany({
            where: {
                createdBy: userId,
            },
        });

        if (projects.length === 0) {
            console.log('No projects found for user ID:', userId);
        } else {
            console.log('Projects found:', projects);
        }

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}