import { useTodosData } from "./useTodosData";
import { useConfirmationModal } from "./useConfirmationModal";

export const useTodoManagement = () => {
  const {
    tasks,
    addTask,
    toggleComplete,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
  } = useTodosData();

  const {
    confirmationModal,
    openDeleteModal,
    openDeleteCompletedModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const hasCompletedTasks = tasks.some((task) => task.completed);

  // Wrappers to connect modal state with data actions
  const handleDeleteTaskConfirmed = () => {
    const { taskId } = confirmationModal;
    if (taskId) {
      deleteTask(taskId);
      closeConfirmationModal();
    }
  };

  const handleDeleteCompletedConfirmed = () => {
    deleteCompletedTasks();
    closeConfirmationModal();
  };

  return {
    tasks,
    hasCompletedTasks,
    handleAddTodo: addTask,
    handleToggleComplete: toggleComplete,
    handleUpdateTask: updateTask,
    // Modal controls
    confirmationModal,
    openDeleteModal,
    openDeleteCompletedModal,
    closeConfirmationModal,
    // Actions connected to modal
    handleDeleteTask: handleDeleteTaskConfirmed,
    handleDeleteCompletedTasks: handleDeleteCompletedConfirmed,
  };
};
