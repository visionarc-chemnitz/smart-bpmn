import { useState } from 'react';
import { useUser } from "@/providers/user-provider" // Assuming this provides user data

export const useProjectModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const user = useUser(); // Fetch the current user details

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Handle case when user.id is missing but user.email is available
    if (!user || !user.email) {
      console.error('User is not logged in or user email is missing');
      window.alert('User is not logged in or user email is missing');
      return;
    }
  
    const requestBody = {
      projectName: projectName,
      organizationName: organizationName,
      ownerName: user.name,
      ownerEmail: user.email,
    };
    console.log('Request Body:', requestBody);
  
    try {
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
      closeModal();
    } catch (error) {
      console.error('Error while creating project:', error);
      window.alert('An error occurred while saving the data.');
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    handleSubmit,
    ownerName,
    setOwnerName,
    ownerEmail,
    setOwnerEmail, // Expose user email if needed in the component
  };
};
