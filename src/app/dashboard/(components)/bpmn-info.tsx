import React from 'react';
import { useModalManager } from '@/hooks/useModalManager';
import BpmnFileInfoModal from '../bpmn-info/(components)/bpmn-file-info-modal'; // Correct the import path

export default function BpmnInfo() {
  const {
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
        onSubmit={handleBpmnFileSubmit} // Directly pass it
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