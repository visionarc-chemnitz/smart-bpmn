import { useState, useEffect } from 'react';
import { useUser } from "@/providers/user-provider"; // Assuming this provides user data

export const useProjectModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [projects, setProjects] = useState<any[]>([]); // State to hold projects
  const [selectedProject, setSelectedProject] = useState<any | null>(null); // Selected project state
  const user = useUser(); // Fetch the current user details
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/get-projects?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects.');
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error('User is not logged in or user ID is missing');
      window.alert('User is not logged in or user ID is missing');
      return;
    }

    const requestBody = {
      projectName: projectName,
      organizationName: organizationName,
      createdBy: user.id,
    };

    try {
      setIsLoading(true);
      const response = await fetch('/api/add-project-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      window.alert('Project is created successfully!');

      // Update the projects state with the new project
      setProjects((prevProjects) => [...prevProjects, data]);

      // Automatically select the new project
      setSelectedProject(data);

      closeModal(); // Close the modal
    } catch (error) {
      console.error('Error while creating project:', error);
      window.alert('An error occurred while saving the data.');
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchProjects(); // Fetch projects when the component mounts or user changes
    }
  }, [user]);

  return {
    isOpen,
    openModal,
    closeModal,
    projectName,
    setProjectName,
    organizationName,
    setOrganizationName,
    handleSubmit,
    projects, // Return the projects state
    selectedProject, // Return the selected project
    isLoading, // Return loading state
  };
};