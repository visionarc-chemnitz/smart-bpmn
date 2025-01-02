import { useState } from 'react';
import { useUser } from "@/providers/user-provider" // Assuming this provides user data

export const useOrganizationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const user = useUser(); // Fetch the current user details
  //alert('user: ' + user.email);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error('User is not logged in or user ID is missing');
      return;
    }

    const requestBody = {
      organizationName: organizationName,
      ownerId: user.id,
    };
    console.log('Request Body:', requestBody);

    try {
      const response = await fetch('/api/save-organization-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error('Error creating organization');
      }

      const data = await response.json();
      console.log('Organization created:', data);
      closeModal();
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  return {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    handleSubmit,
  };
};