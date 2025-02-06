"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Bpmn, BPMNFilesByOrg, BpmnXML } from "@/types/bpmn/bpmn";
import { Organization } from "@/types/organization/organization";
import { Project } from "@/types/project/project";
import { Role } from "@prisma/client";
import { BpmnFileWithProjectAndVersion } from "@/types/bpmn/bpmnVersion";


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
export const getStakeholderOrgProject = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID and Organization ID are required');
    }

    const projects = await prisma.project.findMany({
      where: {
        bpmn:{
          some: {
            StakeholderBpmn: {
              some: {
                userId: userId,
              },
            },
          },
        }
      },
      select:{
        id: true,
        name: true,
      }
    });

    return projects;

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
    const newFile = await prisma.bpmn.create({
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
        threadId: true,
        isFavorite: true,
      }
    });

    const versionedBpmn = await saveBpmnVersion(newFile.id, '', '1', userId, false); // Create first version
    const bpmn = {...newFile, currentVersionId: versionedBpmn.id};

    return bpmn;
  } catch (error) {
    console.error('Error creating BPMN file:', error);
    throw error;
  }
}

// get version of bpmn file
export const getBpmnFileVersion = async (bpmnId: string, userId: string) => {
  try {
    // TODO:Check this as it is not working returning empty object
    console.log('bpmnId =', bpmnId);
    const bpmnFile = await prisma.bpmn.findUnique({
      where: {
        id: bpmnId,
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

    return bpmnFile;
  } catch (error) {
    console.error('Error fetching BPMN file versions:', error);
    throw error;
  }
}

// save bpmn-version
export const saveBpmnVersion = async (bpmnId: string, xml: string, versionNumber: string, userId: string, isShared?: boolean) => {
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

      let flag = true;
      // handle isSharedFlag
      if(isShared !== undefined) {
        flag = isShared;
      }

      // Update BPMN with new version ID
      await tx.bpmn.update({
        where: { id: bpmnId },
        data: {
          currentVersionId: newVersion.id,
          isShared: flag,
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

// save bpmn data in existing file
export const saveBPMN = async (bpmnId: string, currVersionId: string, userId: string,  xml: string,) => {
  try {
    const updateExisting = await prisma.bpmnVersion.update({
      where:{
        id: currVersionId,
        bpmnId: bpmnId,
      },data:{
        xml: xml,
        updatedBy: userId,
      },
      select:{
        id: true,
        bpmnId: true,
        versionNumber: true,
        updatedBy: true,
      }
    });

    if (!updateExisting) {
      throw new Error('Failed to update BPMN version');
    }

    return updateExisting;
      
  } catch (error) {
    console.error('Error saving BPMN data in existing file:', error);
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
        threadId: true,
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
            threadId: true,
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
            threadId: true,
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
    
    if (res && res?.length > 0) {
      bpmnFiles = res.map((file) => {
        return {
          id: file.id,
          fileName: file.fileName,
          createdBy: file.createdBy,
          isShared: file.isShared,
          isFavorite: file.isFavorite,
          threadId: file.threadId,
          currentVersionId: file.currentVersion?.id ?? '',
        }
      })
    }

    return bpmnFiles;
  } catch (error) {
    console.error('Error fetching BPMN files:', error);
    throw error;
  }
}

//fetch bpmn files by orgs (only for stakeholder)
export const fetchBpmnFilesbyOrg = async (userId: string): Promise<BPMNFilesByOrg> => {
  try {
    const bpmnFiles: BPMNFilesByOrg = new Map<string, BpmnXML[]>();

    const res = await prisma.bpmn.findMany({
      where: {
        StakeholderBpmn: {
          some: {
          userId: userId
          }
        }
      },
      select: {
        id: true,
        fileName: true,
        isShared: true,
        isFavorite: true,
        createdAt: true,
        currentVersion: {
          select: {
            id: true,
            versionNumber: true,
            xml: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            organizationId: true
          }
        }
      }
    });

    if (res && res.length > 0) {
      res.forEach((file) => {
        const orgId = file.project?.organizationId;
        if (orgId) {
          if(!bpmnFiles.has(orgId)) {
            bpmnFiles.set(orgId, []);
          }
          bpmnFiles.set(orgId, [
            ...(bpmnFiles.get(orgId) || []),
            {
              id: file.id,
              fileName: file.fileName,
              isShared: file.isShared,
              isFavorite: file.isFavorite,
              projectId: file.project?.id ?? '',
              projectName: file.project?.name ?? '',
              currentVersionId: file.currentVersion?.id ?? '',
              xml: file.currentVersion?.xml ?? '',
              // createdAt: file.createdAt,
            }
          ]);
        }
      });
      
    }

    return bpmnFiles;

  } catch (error) {
    console.error('Error fetching BPMN files for stakeholder:', error);
    throw error; 
  }

}

// fetch bpmn files with projects and versions
export const fetchBpmnFilesWithProjectsAndVersions = async (orgId: string): Promise<BpmnFileWithProjectAndVersion[]> => {
  try {
    const res = await prisma.bpmn.findMany({
      where: {
        project: {
          organizationId: orgId
        }
      },
      select: {
        id: true,
        fileName: true,
        BpmnVersion: {
          select: {
            id: true,
            versionNumber: true,
            xml: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    const filteredRes = res.filter(file => file.BpmnVersion.length > 0);

    const bpmnFilesWithProjectsAndVersions: BpmnFileWithProjectAndVersion[] = filteredRes.map(file => ({
      id: file.id,
      fileName: file.fileName,
      BpmnVersion: file.BpmnVersion.map(version => ({
        id: version.id ?? '',
        versionNumber: version.versionNumber ?? '',
        xml: version.xml ?? ''
      })),
      project: {
        id: file.project?.id ?? '',
        name: file.project?.name ?? ''
      }
    }));
    
    return bpmnFilesWithProjectsAndVersions;

  } catch (error) {
    console.error('Error fetching BPMN files with projects and versions:', error);
    throw error;
  }
}

// rename user 
export const renameUser = async (userId: string, name: string): Promise<boolean> => {
  try {
    const res = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true }
    });
    return true;
  } catch (error) {
    console.error('Error renaming user:', error);
    throw error;
  }
}