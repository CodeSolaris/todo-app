import { memo } from "react";
import { ToggleCompleteButton } from "./ToggleCompleteButton";
import { DeleteTaskButton } from "./DeleteTaskButton";
import { useTodoItem } from "../../hooks/useTodoItem";
import { TaskBody } from "./TaskBody";
import { useSortable } from "@dnd-kit/sortable";
import { motion as Motion } from "framer-motion";

export const TodoItem = memo(
  ({ task, onDelete, onToggleComplete, onUpdateTask, isOverlay, isOpaque }) => {
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
      disabled: isOverlay,
    });

    const dndStyle = {
      transition,
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      zIndex: isDragging || isOverlay ? 100 : 0,
      opacity: isOpaque ? 0 : 1, // Hide original item while dragging
    };

    return (
      <Motion.li
        layout
        initial={isOverlay ? false : { opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          scale: isOverlay ? 1.05 : 1,
          boxShadow: isOverlay
            ? "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          y: 0,
          opacity: 1,
        }}
        exit={{ opacity: 0, scale: 0.8, x: -20, transition: { duration: 0.2 } }}
        className={`group flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm transition-shadow duration-300 ${
          isOverlay ? "cursor-grabbing" : ""
        }`}
        ref={setNodeRef}
        {...(!isOverlay ? attributes : {})}
        style={dndStyle}
      >
        <div
          {...(!isOverlay ? listeners : {})}
          className={`px-4 shrink-0 flex items-center justify-center self-stretch -ml-3 -my-3 rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
            isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"
          }`}
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
      </Motion.li>
    );
  }
);
