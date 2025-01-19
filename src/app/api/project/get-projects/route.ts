import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { Project, Role } from '@prisma/client';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    console.error('User not authenticated');
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');
  if (!organizationId) {
    console.error('User not authenticated');
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  let projects: Project[] = [];

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (user === null) {
      console.log('User not found for ID:', session.user.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === Role.MEMBER || user.role === Role.ADMIN) {
      projects = await prisma.project.findMany({
        where: {
          organizationId: organizationId,
        },
      });
    }

    if (user.role === Role.STAKEHOLDER) {
      projects = await prisma.project.findMany({
        where: {
          organizationId: organizationId,
          bpmn: {
            some: {
              StakeholderBpmn: {
                some: {
                  userId: user.id,
                },
              },
            },
          },
        },
      });
    }
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
