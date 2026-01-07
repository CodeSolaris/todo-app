import { useTheme } from "./hooks/useTheme";
import { useTodo } from "./hooks/useTodo";
import { ToggleTheme } from "./components/layout/ToggleTheme";
import { DeleteConfirmModal } from "./components/ui/DeleteConfirmModal";
import { DeleteCompletedButton } from "./components/todo-list/DeleteCompletedButton";
import { MainContent } from "./components/layout/MainContent";
import { motion as Motion, AnimatePresence } from "framer-motion";

export function App() {
  const { theme } = useTheme();
  const {
    tasks,
    confirmationModal,
    closeConfirmationModal,
    handleDeleteTask,
    handleDeleteCompletedTasks,
  } = useTodo();

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-theme={theme}
      className="flex flex-col items-center h-screen overflow-hidden bg-page-light dark:bg-page-dark text-txt-light dark:text-txt-dark p-6 pt-[20vh]"
    >
      <ToggleTheme />
      <MainContent />

      <AnimatePresence>
        {confirmationModal.isOpen && (
          <DeleteConfirmModal
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
        )}
      </AnimatePresence>

      <DeleteCompletedButton />
    </Motion.div>
  );
}
