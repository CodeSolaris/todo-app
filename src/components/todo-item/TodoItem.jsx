import { ToggleCompleteButton } from "./ToggleCompleteButton";
import { DeleteTaskButton } from "./DeleteTaskButton";
import { useTodoItem } from "../../hooks/useTodoItem";
import { TaskBody } from "./TaskBody";

export const TodoItem = ({
  task,
  onDelete,
  onToggleComplete,
  onUpdateTask,
}) => {
  const {
    isEditing,
    setIsEditing,
    editText,
    setEditText,
    editDeadline,
    setEditDeadline,
    editFormRef,
    handleSave,
  } = useTodoItem(task, onUpdateTask);

  return (
    <li className="group flex items-center justify-between gap-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <ToggleCompleteButton
        isCompleted={task.completed}
        onToggle={() => onToggleComplete(task.id)}
      />
      <div className="flex items-start gap-3 w-full">
        <TaskBody
          isEditing={isEditing}
          editFormRef={editFormRef}
          editText={editText}
          setEditText={setEditText}
          editDeadline={editDeadline}
          setEditDeadline={setEditDeadline}
          handleSave={handleSave}
          task={task}
          onEnableEdit={() => setIsEditing(true)}
        />
      </div>

      <DeleteTaskButton onDelete={() => onDelete(task.id)} />
    </li>
  );
};
