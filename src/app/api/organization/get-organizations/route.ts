import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { Organization, Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    console.error('Invalid user ID:', userId);
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      organization: true,
    },
  });

  if (!user) {
    console.error('User not found:', userId);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  let organizations: Organization[] = [];
  try {
    console.log('Fetching organization for user ID:', userId);
    if (user.role === Role.STAKEHOLDER) {
      organizations = await prisma.organization.findMany({
        where: {
          projects: {
            some: {
              bpmn: {
                some: {
                  StakeholderBpmn: {
                    some: {
                      userId: userId,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (organizations.length === 0) {
        console.log('No organization found for user ID:', userId);
        return NextResponse.json({ error: 'No organization found' }, { status: 404 });
      }

      console.log('Organizations found:', organizations);
    } else if (user.role === Role.ADMIN) {
        organizations = await prisma.organization.findMany({
          where: {
            createdBy: userId,
          },
        });
    } else if (user.role === Role.MEMBER) {
      if (user.organization) {
        organizations = [user.organization];
      }
    }

    if (!organizations || organizations.length === 0) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 });
    }
    return NextResponse.json({organizations}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching organizations' }, { status: 500 });
  }
}
