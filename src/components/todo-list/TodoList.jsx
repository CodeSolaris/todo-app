import { TodoItem } from "../todo-item/TodoItem";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTodo } from "../../hooks/useTodo";
import { useMemo, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";

export const TodoList = ({ tasks }) => {
  const {
    handleReorderTask: onReorderTask,
    openDeleteModal,
    handleToggleComplete,
    handleUpdateTask,
  } = useTodo();

  const [activeId, setActiveId] = useState(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        onReorderTask(active.id, over.id);
      }
    },
    [onReorderTask]
  );

  const TasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeId),
    [tasks, activeId]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={TasksIds} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TodoItem
                key={task.clientId || task.id}
                task={task}
                isOpaque={task.id === activeId}
                onDelete={openDeleteModal}
                onToggleComplete={handleToggleComplete}
                onUpdateTask={handleUpdateTask}
              />
            ))}
          </AnimatePresence>
        </ul>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeId && activeTask ? (
          <TodoItem
            task={activeTask}
            isOverlay
            onDelete={() => {}}
            onToggleComplete={() => {}}
            onUpdateTask={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
