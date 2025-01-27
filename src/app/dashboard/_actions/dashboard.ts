'use server'

import { cache } from 'react';
import { getUserData, getUser, getUserOrgProj, getStakeholderOrgProject, getUserOrgs, getAdminOrgs, createOrganization, createBpmnFile, createProject, fetchBpmnFiles, fetchBpmnFilesbyOrg } from "@/app/_services/user/user.service";
import { userOrg, getStakeHolderOrgs } from '@/app/_services/user/user.service';
import { User, UserRole } from "@/types/user/user";
import { Project } from "@/types/project/project";
import { Organization } from "@/types/organization/organization";
import { Role } from '@prisma/client';
import { Bpmn } from '@/types/bpmn/bpmn';

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
      if (!user?.role ) {
        console.error('Invalid user role');
        return [];
      }

      let projects: Project[] = [];
      switch (user.role) {
        case Role.STAKEHOLDER:
          projects = await getStakeholderOrgProject(user.id);
          break;
        
        case Role.ADMIN || Role.MEMBER:
          if (!user.organizationId) {
            throw new Error('Organization ID is required');
          }
          projects = await getUserOrgProj(user.id, user.organizationId);
          break;       
      }
      
      return projects;
      
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching projects');
    }
});

export async function saveOrganization(orgName: string): Promise<boolean> {
  const session = await getUserData();
  const userId = session?.id;

  if (!userId) {
    throw new Error('User not authorized');
  }

  try {
    const organization = await createOrganization(orgName, userId);

    return organization ? true : false;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw new Error('Error creating organization');
  }
}

// create project
export async function saveProject(projectName: string, orgId: string): Promise<Project> {
  const session = await getUserData();
  const userId = session?.id;

  
  if (!userId) {
    throw new Error('User not authorized');
  }
  const user = await getUser(userId);

  if (user?.role === Role.STAKEHOLDER) {
    throw new Error('User not authorized to create project');
  }
  
  try {
    const project = await createProject(projectName, orgId, userId);

    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Error creating project');
  }
}

// save file
export async function saveFile(fileName: string, projectId: string): Promise<Bpmn> {
  const session = await getUserData();
  const userId = session?.id;

  if (!userId) {
    throw new Error('User not authorized');
  }

  try {
    const file = await createBpmnFile(fileName, projectId, userId);

    return file;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Error saving file');
  }
}

// get bpmn files
export async function getBpmnFiles(projId:string): Promise<Bpmn[]> {
  const session = await getUserData();
  const userId = session?.id;

  if (!userId) {
    throw new Error('User not authorized');
  }

  if (!projId) {
    throw new Error('project ID is required');
  }

  const user = await getUser(userId);
  if(!user) {
    throw new Error('User not found');
  }
  
  const userRole = user?.role;
  if (!userRole) {
    throw new Error('Invalid user role');
  }

  // if (userRole in [Role.ADMIN, Role.MEMBER, Role.STAKEHOLDER]){

  // }

  try {
    const bpmnFiles = await fetchBpmnFiles(projId, userId, userRole);

    return bpmnFiles;
  } catch (error) {
    console.error('Error fetching BPMN files:', error);
    throw new Error('Error fetching BPMN files');
  }
}

// get bpmn files by organization (for stakeholder)
export async function getBpmnFilesbyOrg() {
  const session = await getUserData();
  const userId = session?.id;

  if (!userId) {
    throw new Error('User not authorized');
  }

  const user = await getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const userRole = user?.role;
  if (!userRole || userRole !== Role.STAKEHOLDER) {
    console.error('Invalid user role, must be a stakeholder');
    throw new Error('Invalid user role');
  }

  try {
    const bpmnFiles = await fetchBpmnFilesbyOrg(userId);

    return bpmnFiles;
  } catch (error) {
    console.error('Error fetching BPMN files:', error);
    throw new Error('Error fetching BPMN files');
  }
}