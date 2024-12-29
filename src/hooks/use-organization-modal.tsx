import { useState, useCallback } from 'react';

export const useOrganizationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>([]);

  // Open/Close modal
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Handle email addition
  const handleAddEmail = useCallback(() => {
    if (emailInput && !teamMemberEmails.includes(emailInput)) {
      setTeamMemberEmails((prev) => [...prev, emailInput]);
      setEmailInput('');
    }
  }, [emailInput, teamMemberEmails]);

  // Handle email removal
  const handleRemoveEmail = useCallback(
    (email: string) => {
      setTeamMemberEmails((prev) => prev.filter((e) => e !== email));
    },
    [teamMemberEmails]
  );

  // Form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Organization:', organizationName, 'Team Members:', teamMemberEmails);
      closeModal(); // Close modal after submission
    },
    [organizationName, teamMemberEmails]
  );

  return {
    isOpen,
    openModal,
    closeModal,
    organizationName,
    setOrganizationName,
    emailInput,
    setEmailInput,
    teamMemberEmails,
    handleAddEmail,
    handleRemoveEmail,
    handleSubmit,
  };
};