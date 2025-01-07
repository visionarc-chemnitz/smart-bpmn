import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId || typeof userId !== 'string') {
    console.error('Invalid user ID:', userId);
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
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

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
