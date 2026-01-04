import { TodoItem } from "../todo-item/TodoItem";

export const TodoList = ({
  tasks,
  openDeleteModal,
  handleToggleComplete,
  handleUpdateTask,
}) => {
  return (
    <>
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TodoItem
            key={task.localId || task.id}
            task={task}
            onDelete={() => openDeleteModal(task.id)}
            onToggleComplete={handleToggleComplete}
            onUpdateTask={handleUpdateTask}
          />
        ))}
      </ul>
    </>
  );
};
