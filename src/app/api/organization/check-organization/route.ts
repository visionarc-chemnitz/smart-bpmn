import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserData } from '@/app/_services/user/user.service';

export async function POST(req: NextRequest) {
  const session = await getUserData();
  const userId = session?.id

  if(!userId) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }
  
  try {
    console.log('Checking organization for user ID:', userId);
    const organization = await prisma.organization.findFirst({
      where: {
        createdBy: userId,
      },
      select: {
        id: true,
      }
    });

    return NextResponse.json({ hasOrganization: !!organization }); // Return true if organization exists
  } catch (error) {
    console.error('Error checking organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
