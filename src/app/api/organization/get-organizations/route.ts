import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path as needed
import { Role } from '@prisma/client';
import { getUserData } from '@/app/_services/user/user.service';
import { userOrg, getStakeHolderOrgs } from '@/app/_services/user/user.service';
import { Organization } from '@/types/organization/organization';

export async function GET(req: NextRequest) {
  const session = await getUserData();
  const userId = session?.id

  if(!userId) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  // Fetches user data if he is associated with an organization
  const user = await userOrg(userId);  

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Fetch organizations based on user role
  let organizations: Organization[] = [];
  try {

    switch (user.role) {
      case Role.STAKEHOLDER:
        organizations = await getStakeHolderOrgs(userId);          
        break;
      
      case Role.ADMIN:
        organizations = await prisma.organization.findMany({
          where: {
            createdBy: userId,
          },
        });
        break;
      
      case Role.MEMBER:
        if (user.organization) {
          organizations = [user.organization];
        }
        break;
    
      default:
        organizations = [];  
        console.error('Invalid user role');
        break;
    }

    if (organizations.length === 0) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 });
    }

    return NextResponse.json(organizations, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Error fetching organizations' }, { status: 500 });
  }
}
