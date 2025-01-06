import { useState } from 'react';
import { useUser } from "@/providers/user-provider";

export function useBpmnFileModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [projectId, setProjectId] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [bpmnFiles, setBpmnFiles] = useState<any[]>([]); // State to hold BPMN files
    const user = useUser();
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleFormSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
        formData: {
            fileName: string;
            projectId: string;
            isFavorite: boolean;
            isShared: boolean;
        }
    ) => {
        e.preventDefault(); // Prevent form default behavior
        console.log("Submitting Form with Data:", formData);
        try {
            const response = await fetch('/api/save-bpmn-file-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: formData.fileName,
                    projectId: formData.projectId,
                    createdBy: user.id,
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
            window.location.reload();
        } catch (error) {
            console.error('Error saving BPMN file:', error); // Handle the error
            alert('There was an error saving the BPMN file.');
        }
    };

    return {
        isOpen,
        openModal,
        closeModal,
        fileName,
        setFileName,
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