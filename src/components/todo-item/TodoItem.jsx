import { ToggleCompleteButton } from "./ToggleCompleteButton";
import { DeleteTaskButton } from "./DeleteTaskButton";
import { useTodoItem } from "../../hooks/useTodoItem";
import { TaskBody } from "./TaskBody";
import { useSortable } from "@dnd-kit/sortable";
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });
  const style = {
    transition,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm transition-shadow duration-300 hover:shadow-md"
      ref={setNodeRef}
      {...attributes}
      style={style}
    >
      <div
        {...listeners}
        className="px-4 cursor-grab active:cursor-grabbing shrink-0 flex items-center justify-center self-stretch -ml-3 -my-3 rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <div className="h-6 w-4 border-l-4 border-r-4 border-gray-200 dark:border-gray-600 border-dotted"></div>
      </div>

      <div className="shrink-0">
        <ToggleCompleteButton
          isCompleted={task.completed}
          onToggle={() => onToggleComplete(task.id)}
        />
      </div>

      <div className="flex items-start gap-3 flex-1 min-w-0">
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

      <div className="shrink-0">
        <DeleteTaskButton onDelete={() => onDelete(task.id)} />
      </div>
    </li>
  );
};
