import { TodoItem } from "../todo-item/TodoItem";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTodo } from "../../hooks/useTodo";

export const TodoList = ({ tasks }) => {
  const {
    handleReorderTask: onReorderTask,
    openDeleteModal,
    handleToggleComplete,
    handleUpdateTask,
  } = useTodo();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id !== over.id) {
      onReorderTask(active.id, over.id);
    }
  };
  const TasksIds = tasks.map((task) => task.id);
  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={TasksIds}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                onDelete={() => openDeleteModal(task.id)}
                onToggleComplete={handleToggleComplete}
                onUpdateTask={handleUpdateTask}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </>
  );
};
