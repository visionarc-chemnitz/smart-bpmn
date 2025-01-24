import React from 'react';
import { useModalManager } from '@/hooks/useModalManager';
import { BpmnFileInfoModal } from '@/app/dashboard/_components/modals/bpmnInfoModal'; // Correct the import path

export default function BpmnInfo() {
  const {
    isOpen,
    openModal,
    closeModal,
    fileName,
    projectId,
    isFavorite,
    isShared,
    handleBpmnFileSubmit, // Use the one from the hook
  } = useModalManager();

  

  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Save BPMN
      </button>
      <BpmnFileInfoModal
        isOpen={isOpen}
        onClose={closeModal}
        initialData={{
          fileName: fileName || '',
          projectId: projectId || '',
          createdBy: '', // Empty by default
          isFavorite: isFavorite || false,
          isShared: isShared || false,
        }}
      />
    </div>
  );
}