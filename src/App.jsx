import { useState } from "react";
import ToggleTheme from "./components/layout/ToggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";
import { DeleteConfirmModal } from "./components/ui/DeleteConfirmModal";
import { useTodoManagement } from "./hooks/useTodoManagement";
import { DeleteCompletedButton } from "./components/todo-list/DeleteCompletedButton";
import { MainContent } from "./components/layout/MainContent";

export function App() {
  const [theme, setTheme] = useState(getInitialTheme());
  const {
    tasks,
    hasCompletedTasks,
    handleAddTodo,
    handleToggleComplete,
    handleUpdateTask,
    // Modal controls
    confirmationModal,
    openDeleteModal,
    openDeleteCompletedModal,
    closeConfirmationModal,
    handleDeleteTask,
    handleDeleteCompletedTasks,
    handleReorderTask,
  } = useTodoManagement();

  return (
    <div
      data-theme={theme}
      className="flex flex-col items-center h-screen overflow-hidden bg-page-light dark:bg-page-dark text-txt-light dark:text-txt-dark p-6 pt-[20vh]"
    >
      <ToggleTheme theme={theme} onToggle={() => toggleTheme(setTheme)} />
      <MainContent
        tasks={tasks}
        handleAddTodo={handleAddTodo}
        handleToggleComplete={handleToggleComplete}
        handleUpdateTask={handleUpdateTask}
        openDeleteModal={openDeleteModal}
        onReorderTask={handleReorderTask}
      />

      <DeleteConfirmModal
        isOpen={confirmationModal.isOpen}
        onCancel={closeConfirmationModal}
        onConfirm={() => {
          if (confirmationModal.type === "single") {
            handleDeleteTask();
          } else if (confirmationModal.type === "completed") {
            handleDeleteCompletedTasks();
          }
        }}
        message={
          confirmationModal.type === "single"
            ? "Are you sure you want to delete this task?"
            : `Are you sure you want to delete all ${
                tasks.filter((task) => task.completed).length
              } completed tasks?`
        }
      />

      <DeleteCompletedButton
        openDeleteCompletedModal={openDeleteCompletedModal}
        hasCompletedTasks={hasCompletedTasks}
      />
    </div>
  );
}
