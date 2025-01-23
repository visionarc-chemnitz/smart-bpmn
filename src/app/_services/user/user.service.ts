"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Organization } from "@/types/organization/organization";
import { Project } from "@/types/project/project";


export const updateUserName = async (id: string, name: string) => {
  try {
    const session = await auth(); // Fetch user session
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    const account = await prisma.user.update({
      where: { id },
      data: { name },
    });
    return account;
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const session = await auth(); // Fetch user session
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    const account = await prisma.user.findUnique({
      where: { id },
    });
    return account;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const session = await auth(); // Fetch user session
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    return session?.user; 
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// ************ Prisma Utility Functions ************ //

// Fetches user if he has an organization
export const userOrg = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true }
    });
    return user;
  } catch (error) {
    console.error('Error fetching user\'s organization:', error);
    throw error;
  }
}

// gets org's where user is a stakeholder
export const getStakeHolderOrgs = async (userId: string): Promise<Organization[]> => {
  try {
    const res = await prisma.organization.findMany({
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
      select: {
        id: true,
        name: true,
      },
    });
    
    return res;
  } catch (error) {
    console.error('Error fetching stakeholder organizations:', error);
    throw error;
  }
}

// DOUBT: why fetch many if user can only be in one org?
export const getAdminOrgs = async (userId: string): Promise<Organization[]> => {
  try {
    const res = await prisma.organization.findMany({
      where: { createdBy: userId },
      select: { id: true, name: true }
    });
  
    return res;
  } catch (error) {
    console.error('Error fetching Admin organizations:', error);
    throw error;
  }
}

export const getUserOrgs = async (userId: string): Promise<Organization[]> => {
  try {
    const res = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  
    return res?.organization ? [res.organization] : [];
  } catch (error) {
    console.error('Error fetching Admin organizations:', error);
    throw error;
  }
}



// get projects for user in an organization 
export const getUserOrgProj = async (userId: string, orgId: string): Promise<Project[]> => {
  try {
    if (!userId || !orgId) {
      throw new Error('User ID and Organization ID are required');
    }

    const projects = prisma.project.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
        name: true,
      }
    });
    if (!projects) {
      return [];
    }
    return projects;
  } catch (error) {
    throw new Error('Error fetching user organization projects');
  }
}

// get projects for stakeholder 
export const getStakeholderOrgProject = async (userId: string): Promise<Project[]> => {
  try {
    if (!userId) {
      throw new Error('User ID and Organization ID are required');
    }

    return await prisma.project.findMany({
      where: {
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
    });
  } catch (error) {
    throw new Error('Error fetching user organization projects');
  }
}
