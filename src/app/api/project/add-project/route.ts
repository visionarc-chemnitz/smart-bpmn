import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function POST(req: NextRequest) {
  const { projectName, organizationId, createdBy } = await req.json();

  if (!projectName || !organizationId || !createdBy) {
    return NextResponse.json({ error: 'Project name, Organization ID, and createdBy are required' }, { status: 400 });
  }

  try {
    // Create a project using organizationId and createdBy
    const project = await prisma.project.create({
      data: {
        name: projectName,
        organizationId: organizationId, // Link project to the organization
        createdBy: createdBy,  // Save the creator's ID
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);

    if ((error as any).code === 'P2003') {
      return NextResponse.json({ error: 'Invalid organizationId. Organization does not exist.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
  }
}
