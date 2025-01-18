import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  const { organizationName, createdBy } = await req.json();

  if (!organizationName || !createdBy) {
    return NextResponse.json({ error: 'Organization name and createdBy (user ID) are required' }, { status: 400 });
  }

  try {
    // Create the organization using createdBy (user ID)
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        createdBy: createdBy, // Save the user ID who created the organization
      },
    });

    await prisma.user.update({
      where: {
        id: createdBy,
      },
      data: {
        role: Role.ADMIN,
        organizationId: organization.id,
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Error creating organization' }, { status: 500 });
  }
}
