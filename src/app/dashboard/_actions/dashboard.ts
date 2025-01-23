'use server'

import { cache } from 'react';
import { getUserData, getUser, getUserOrgProj, getStakeholderOrgProject, getUserOrgs, getAdminOrgs } from "@/app/_services/user/user.service";
import { userOrg, getStakeHolderOrgs } from '@/app/_services/user/user.service';
import { User, UserRole } from "@/types/user/user";
import { Project } from "@/types/project/project";
import { Organization } from "@/types/organization/organization";
import { Role } from '@prisma/client';

export const getUserOrganizations = cache(async (): Promise<Organization[]> => {
  const session = await getUserData();
  const userId = session?.id

  if(!userId) {
    throw new Error('Invalid user ID');
  }

  const user = await userOrg(userId);  

  if (!user) {
    throw new Error('User not found');
  }

  try {
    let organizations: Organization[] = [];

    switch (user.role) {
      case Role.STAKEHOLDER:
        organizations = await getStakeHolderOrgs(userId);          
        break;
      
      case Role.ADMIN:
        organizations = await getAdminOrgs(userId);
        break;
      
      case Role.MEMBER:
        organizations = await getUserOrgs(userId);
        break;
    
      default:
        console.error('Invalid user role');
        break;
    }

    // if (organizations.length === 0) {
    //   return [];
    // }

    return organizations;

  } catch (error) {
    throw new Error('Error fetching organizations');
  }
});

export const getUserInfo = cache(async (): Promise<User> => {
  const session = await getUserData();
  
  if (!session?.id) {
    throw new Error('Invalid user ID');
  }

  const user = await getUser(session.id);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    name: user.name ?? undefined,
    email: user.email ?? undefined,
    avatar: user.image ?? undefined,
    role: user.role as UserRole ?? undefined,
    organizationId: user.organizationId || ''
  };
});

export const getOrgProjects = cache(async (): Promise<Project[]> => {
    const session = await getUserData();
    const userId = session?.id;
  
    if (!userId) {
      throw new Error('User not authenticated');
    }
  
    try {

      const user = await getUser(userId);
      if (!user?.role || !user?.organizationId) {
        console.error('Invalid user role or organization ID');
        return [];
      }

      let projects: Project[] = [];
      switch (user.role) {
        case Role.STAKEHOLDER:
          projects = await getStakeholderOrgProject(user.id, user.organizationId);
          break;
        
        case Role.ADMIN || Role.MEMBER:
          projects = await getUserOrgProj(user.id, user.organizationId);
          break;
       
        default:
          console.error('Invalid user role', user);
          throw new Error('Invalid user role');
          break;
      }
      
      return projects;
      
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching projects');
    }
});
