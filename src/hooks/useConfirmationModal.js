import { useState, useCallback } from "react";

export const useConfirmationModal = () => {
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null, // "single" | "completed"
    taskId: null,
  });

  const openDeleteModal = useCallback((taskId) => {
    setConfirmationModal({ isOpen: true, type: "single", taskId });
  }, []);

  const openDeleteCompletedModal = useCallback(() => {
    setConfirmationModal({ isOpen: true, type: "completed", taskId: null });
  }, []);

  const closeConfirmationModal = useCallback(() => {
    setConfirmationModal({ isOpen: false, type: null, taskId: null });
  }, []);

  return {
    confirmationModal,
    openDeleteModal,
    openDeleteCompletedModal,
    closeConfirmationModal,
  };
};
