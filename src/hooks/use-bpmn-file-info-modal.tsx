import { useState } from 'react';
import { useUser } from "@/providers/user-provider";

export function useBpmnFileModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentVersionId, setCurrentVersionId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [bpmnFiles, setBpmnFiles] = useState([]); // State to hold BPMN files
    const user = useUser();
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleFormSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
        formData: {
            currentVersionId: string;
            projectId: string;
            ownerEmail: string;
            isFavorite: boolean;
            isShared: boolean;
        }
    ) => {
        e.preventDefault(); // Prevent form default behavior

        // Log data to console for debugging
        console.log("Submitting Form with Data:", formData);

        // Now make the API request to save the BPMN data
        try {
            const response = await fetch('/api/save-bpmn-file-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentVersionId: formData.currentVersionId,
                    projectId: formData.projectId,
                    ownerName: user.name,
                    ownerEmail: formData.ownerEmail,
                    isFavorite: formData.isFavorite,
                    isShared: formData.isShared,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save BPMN file');
            }

            const data = await response.json();
            console.log('BPMN file saved:', data); // Handle the success response
            window.alert('BPMN file saved successfully!');
            // Optionally close the modal after successful submission
            closeModal();
            // Update the state with the new BPMN file
            setBpmnFiles((prevFiles) => [...prevFiles, data]);
        } catch (error) {
            console.error('Error saving BPMN file:', error); // Handle the error
            alert('There was an error saving the BPMN file.');
        }
    };

    return {
        isOpen,
        openModal,
        closeModal,
        currentVersionId,
        setCurrentVersionId,
        projectId,
        setProjectId,
        isFavorite,
        setIsFavorite,
        isShared,
        setIsShared,
        handleFormSubmit, // Return the handleFormSubmit function
        bpmnFiles, // Return the BPMN files state
    };
}