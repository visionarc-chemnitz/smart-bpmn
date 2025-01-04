import React from 'react';
import { useBpmnFileModal } from '@/hooks/use-bpmn-file-info-modal';
import BpmnFileInfoModal from '../bpmn-info/(components)/bpmn-file-info-modal';

export default function BpmnInfo() {
  const {
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
    handleFormSubmit, // Directly use the one from the hook
  } = useBpmnFileModal();

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
        onSubmit={handleFormSubmit} // Directly pass it
        initialData={{
          currentVersionId: currentVersionId || '',
          projectId: projectId || '',
          ownerEmail: '', // Empty by default
          isFavorite: isFavorite || false,
          isShared: isShared || false,
        }}
      />
    </div>
  );
}
