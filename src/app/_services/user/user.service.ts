"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Bpmn } from "@/types/bpmn/bpmn";
import { Organization } from "@/types/organization/organization";
import { Project } from "@/types/project/project";
import { Role } from "@prisma/client";


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
export const getStakeholderOrgProject = async (userId: string, orgId: string): Promise<Project[]> => {
  try {
    if (!userId || !orgId) {
      throw new Error('User ID and Organization ID are required');
    }

    return await prisma.project.findMany({
      where: {
        organizationId: orgId,
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


// create organization
export const createOrganization = async (orgName: string, userId: string) => {
  try {
    const organization = await prisma.organization.create({
      data: {
        name: orgName,
        createdBy: userId,
      },
      select: {
        id: true
      }
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: 'ADMIN',
        organizationId: organization.id,
      },
    });

    return organization ? true : false;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
}


// create project
export const createProject = async (projectName: string, orgId: string, userId: string): Promise<Project> => {
  try {
    const project = await prisma.project.create({
      data: {
        name: projectName,
        organizationId: orgId,
        createdBy: userId,
      },
      select: {
        id: true,
        name: true
      }
    });

    return project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// create bpmn file
export const createBpmnFile = async (fileName: string, projectId: string, userId: string): Promise<Bpmn> => {
  try {
    const bpmn = await prisma.bpmn.create({
      data: {
        fileName: fileName,
        projectId: projectId,
        createdBy: userId,
      },
      select: {
        id: true,
        fileName: true,
        createdBy: true,
        isShared: true,
        isFavorite: true,
      }
    });

    return bpmn
  } catch (error) {
    console.error('Error creating BPMN file:', error);
    throw error;
  }
}

// get version of bpmn file
export const getBpmnFileVersion = async (bpmnId: string, userId: string) => {
  try {
    console.log('bpmnId =', bpmnId);
    const bpmnFile = await prisma.bpmn.findFirst({
      where: {
        id: bpmnId,
        createdBy: userId,
      },
      select: {
        id: true,
        fileName: true,
        createdBy: true,
        isShared: true,
        isFavorite: true,
        currentVersion: {
          select: {
            id: true,
            versionNumber: true,
          }
        }
      }
    });
    console.log(bpmnFile);
    return bpmnFile;
  } catch (error) {
    console.error('Error fetching BPMN file versions:', error);
    throw error;
  }
}

// save bpmn-version
export const saveBpmnVersion = async (bpmnId: string, xml: string, versionNumber: string, userId: string) => {
  try {

    const bpmnVersion = await prisma.$transaction(async (tx) => {
      // Create new version
      const newVersion = await tx.bpmnVersion.create({
        data: {
          bpmnId,
          xml,
          versionNumber,
          updatedBy: userId,
        },
        select: {
          id: true,
          xml: true,
          versionNumber: true,
        }
      });

      // Update BPMN with new version ID
      await tx.bpmn.update({
        where: { id: bpmnId },
        data: {
          currentVersionId: newVersion.id,
          isShared: true,
        }
      });

      return newVersion;
    });

    return bpmnVersion;
  } catch (error) {
    console.error('Error saving BPMN version:', error);
    throw error;
  }
}

// check file
export const checkFile = async (bpmnId: string, userId: string) => {
  try {
    const bpmnFile = await prisma.bpmn.findFirst({
      where: {
        id: bpmnId,
        createdBy: userId,
      },
      select: {
        createdBy: true,
        fileName: true,
        createdAt: true,
        id: true,
        isShared: true,
        isFavorite: true,
        currentVersionId: true,
        currentVersion: {
          select: {
            id: true,
            xml: true,
            versionNumber: true,
          }
        }
      }
    });

    return bpmnFile;
  }
  catch (error) {
    console.error('Error checking BPMN file:', error);
    throw error;
  }
}

// get bpmn files
export const fetchBpmnFiles = async (projId: string, userId: string, userRole : Role): Promise<Bpmn[]> => {
  try {

    let bpmnFiles: Bpmn[] = [];
    let res;
    switch (userRole) {
      case Role.STAKEHOLDER:
        res = await prisma.bpmn.findMany({
          where: {
            projectId: projId,
            StakeholderBpmn: {
              some: {
                userId: userId,
              },
            },
          },
          select:{
            id: true,
            fileName: true,
            createdBy: true,
            isShared: true,
            isFavorite: true,
            currentVersion: {
              select: {
                id: true,
                versionNumber: true,
              }
            }
          }
        });
        break;
      
      case Role.ADMIN || Role.MEMBER: 
        res = await prisma.bpmn.findMany({
          where: {
            projectId: projId,
          },
          select: {
            id: true,
            fileName: true,
            createdBy: true,
            isShared: true,
            isFavorite: true,
            currentVersion: {
              select: {
                id: true,
                versionNumber: true,
              }
            }
          }
        });
      break;
    }

    console.log(res);
    // const bpmnFiles = 

    return bpmnFiles;
  } catch (error) {
    console.error('Error fetching BPMN files:', error);
    throw error;
  }
}