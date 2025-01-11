import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    console.error('Invalid user ID:', userId);
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    console.log('Checking organization for user ID:', userId);
    const organization = await prisma.organization.findFirst({
      where: {
        createdBy: userId,
      },
    });

    return NextResponse.json({ hasOrganization: organization !== null });
  } catch (error) {
    console.error('Error checking organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
