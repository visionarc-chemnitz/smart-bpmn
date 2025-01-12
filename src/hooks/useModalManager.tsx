import { useState, useEffect } from 'react';
import { useUser } from "@/providers/user-provider";
import { API_PATHS } from '@/app/api/api-path/apiPath';

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
    const [projects, setProjects] = useState<any[]>([]);
    const [bpmnFiles, setBpmnFiles] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const user = useUser();

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
                localStorage.setItem('selectedOrganizationId', '');
                return null;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch organization.');
            }

            const data = await response.json();
            if (data.organizations.length > 0) {
                setOrganizations(data.organizations);
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
            console.log('Projects:', data.projects);
            setProjects(data.projects);
        } catch (error) {
           console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle organization submission
    const handleOrganizationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.id) {
            window.alert('User is not logged in or user ID is missing');
            return;
        }

        if (!organizationName) {
            window.alert('Organization name is required');
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
            closeModal();
            window.alert('Organization has been created successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error creating organization:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle project submission
    const handleProjectSubmit = async (e: React.FormEvent) => {
        const selectedOrganizationId = localStorage.getItem('selectedOrganizationId');
        e.preventDefault();

        if (!user || !user.id) {
            //console.error('User is not logged in or user ID is missing');
            window.alert('User is not logged in or user ID is missing');
            return;
        }

        if (!selectedOrganizationId) {
            console.error('Organization is not created');
            window.alert('Organization is not created');
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
                window.alert('Failed to create project.');
                throw new Error('Error while creating project');
            }

            const data = await response.json();
            console.log('Project created:', data);
            setProjects((prevProjects) => [...prevProjects, data]);
            setSelectedProject(data);
            closeModal();
            window.alert('Project is created successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error while creating project:', error);
            window.alert('An error occurred while saving the data.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle BPMN file submission
    const handleBpmnFileSubmit = async (e: React.FormEvent<HTMLFormElement>, formPayload: { fileName: string; projectId: string; createdBy: string; isFavorite: boolean; isShared: boolean; }) => {
        e.preventDefault();
        // Prevent multiple submissions
        if (isLoading) return;
        // Prepare the form data payload
        const formPayloadData = {
            fileName,
            projectId,
            createdBy: user.id,
            isFavorite,
            isShared,
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
            console.log('BPMN file saved successfully:', data);

            // Update state and close modal
            setBpmnFiles((prevFiles) => [...prevFiles, data]);
            closeModal();

            // Show success alert and reload the page
            window.alert('BPMN file saved successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch initial data on mount
    useEffect(() => {
        if (user && user.id) {
            fetchOrganization();
            fetchProjects();
        }
    }, [user]);

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
        fetchOrganization,
        fetchProjects,
        organizations,
        projects,
        bpmnFiles,
        selectedProject,
        isLoading,
    };
};