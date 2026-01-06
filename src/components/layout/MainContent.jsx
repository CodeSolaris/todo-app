import { AddTodo } from "../todo-add/AddTodo";
import { Header } from "./Header";
import { TodoList } from "../todo-list/TodoList";
import { TodoFilter } from "../todo-list/TodoFilter";
import { useState } from "react";
export const MainContent = ({
  tasks,
  handleAddTodo,
  handleToggleComplete,
  handleUpdateTask,
  openDeleteModal,
  onReorderTask,
}) => {
  const [filter, setFilter] = useState("all");
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="mx-auto flex flex-col gap-3 max-w-xl w-full h-full overflow-hidden">
      <div className="flex flex-col gap-3 shrink-0">
        <Header />
        <AddTodo onAddTodo={handleAddTodo} />
        <TodoFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <TodoList
          tasks={filteredTasks}
          openDeleteModal={openDeleteModal}
          handleToggleComplete={handleToggleComplete}
          handleUpdateTask={handleUpdateTask}
          onReorderTask={onReorderTask}
        />
      </div>
    </div>
  );
};
