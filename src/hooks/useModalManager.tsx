import { useState, useEffect } from 'react';
import { useUser } from "@/providers/user-provider";
import { API_PATHS } from '@/app/api/api-path/apiPath';
import { toast } from "sonner"
import { useOrganizationStore } from '@/store/organization-store';
import { useWorkspaceStore } from '@/store/workspace-store';

export const useModalManager = () => {
    // State variables
    const [isOpen, setIsOpen] = useState(false);
    const [organizationName, setOrganizationName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [fileName, setFileName] = useState('');
    const [projectId, setProjectId] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [organizations, setOrganizations] = useState<any | null>(null);
    const [bpmnFiles, setBpmnFiles] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser();

    const { setCurrentOrganization, currentOrganization} = useOrganizationStore();
    const { currentProject, setCurrentProject, projectList, setProjectList, setCurrentBpmn, setSelectionChanged} = useWorkspaceStore();

    // Modal management
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // Fetch organization data
    const fetchOrganization = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_PATHS.GET_ORGANIZATION}?userId=${user.id}`);

            if (response.status === 404) {
                setOrganizations([]);
                setCurrentOrganization(null);
                return null;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch organization.');
            }

            const data = await response.json();
            if (data.organizations.length > 0) {
                setOrganizations(data.organizations);
                setCurrentOrganization(data.organizations[0]);
            }
            return data.organizations;
        } catch (error) {
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch projects
    const fetchProjects = async () => {
        const selectedOrganizationId = localStorage.getItem('selectedOrganizationId');
        try {
            setIsLoading(true);
            const response = await fetch(`${API_PATHS.GET_PROJECTS}?organizationId=${selectedOrganizationId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch projects.');
            }
            const data = await response.json();
            setProjectList(data.projects);
            if (data.projects.length > 0) {
                setCurrentProject(data.projects[0]);
            } else {
                setCurrentProject(null);
            }
        } catch (error) {
           console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBpmnFiles = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_PATHS.GET_BPMN_FILES}?projectId=${currentProject?.id}`);
            const data = await response.json();
            setBpmnFiles(data.bpmnFiles || []);

            // Automatically select the first file if none is selected
            if (data.bpmnFiles?.length > 0) {
                setCurrentBpmn(data.bpmnFiles[0]);
            } else {
                setCurrentBpmn(null);
            }
            setSelectionChanged(true);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Handle organization submission
    const handleOrganizationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.id) {
            toast.error('User is not logged in or user ID is missing');
            return;
        }

        if (!organizationName) {
            toast.error('Organization name is required');
            return;
        }

        const requestBody = {
            organizationName,
            createdBy: user.id,
        };

        try {
            setIsLoading(true);
            const response = await fetch(API_PATHS.SAVE_ORGANIZATION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();

                throw new Error('Error creating organization');
            }

            const data = await response.json();
            setOrganizations(data);
            setCurrentOrganization(data);
            closeModal();
            toast.success('Organization has been created successfully.');
            window.location.reload();
        } catch (error) {
            console.error('Error creating organization:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle project submission
    const handleProjectSubmit = async (e: React.FormEvent) => {
        const selectedOrganizationId = currentOrganization?.id;
        e.preventDefault();
        if (isLoading) return;

        if (!user || !user.id) {
            toast.error('User is not logged in or user ID is missing');
            return;
        }

        if (!selectedOrganizationId) {
            toast.error('Organization is not selected');
            return;
        }

        const requestBody = {
            projectName,
            organizationId: selectedOrganizationId,
            createdBy: user.id,
        };

        try {
            setIsLoading(true);
            const response = await fetch(API_PATHS.ADD_PROJECT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Response:', errorData);
                toast.error('Failed to create project.');
            }

            const data = await response.json();
            toast.success('Project has been created successfully.');
            setProjectList([...projectList, data]);
            setCurrentProject(data);
            closeModal();
        } catch (error) {
            toast.error('An error occurred while creating project.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle BPMN file submission
    const handleBpmnFileSubmit = async (e: React.FormEvent<HTMLFormElement>, formPayload: { fileName: string; projectId: string; createdBy: string; }) => {
        e.preventDefault();
        // Prevent multiple submissions
        if (isLoading) return;
        // Prepare the form data payload
        const formPayloadData = {
            fileName,
            projectId,
            createdBy: user.id,
        };

        try {
            setIsLoading(true);
            // Make API request to save BPMN file
            const response = await fetch(API_PATHS.SAVE_BPMN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formPayloadData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error(errorData.error || 'Failed to save BPMN file');
            }

            // Parse response data
            const data = await response.json();
            toast.success('BPMN has been saved successfully.');

            // Update state and close modal
            setBpmnFiles((prevFiles) => [...prevFiles, data]);
            setCurrentBpmn(data);
            fetchBpmnFiles();
            // Set the new bpmn file's project as current project
            const project = projectList.find((project) => project.id === projectId);
            if (project) {
                setCurrentProject(project);
            }

            closeModal();

        } catch (error) {
            toast.error('An error occurred while saving BPMN.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isOpen,
        openModal,
        closeModal,
        organizationName,
        setOrganizationName,
        projectName,
        setProjectName,
        fileName,
        setFileName,
        projectId,
        setProjectId,
        isFavorite,
        setIsFavorite,
        isShared,
        setIsShared,
        handleOrganizationSubmit,
        handleProjectSubmit,
        handleBpmnFileSubmit,
        // fetchOrganization,
        fetchProjects,
        organizations,
        bpmnFiles,
        selectedProject,
        isLoading,
    };
};