import { AddTodo } from "../todo-add/AddTodo";
import { Header } from "./Header";
import { TodoFilter } from "../todo-list/TodoFilter";
import { useState, lazy, Suspense } from "react";
import { Spinner } from "../ui/Spinner";
import { useTodo } from "../../hooks/useTodo";

// Lazy load TodoList
const TodoList = lazy(() =>
  import("../todo-list/TodoList").then((module) => ({
    default: module.TodoList,
  }))
);

export const MainContent = () => {
  const { tasks } = useTodo();
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
        <AddTodo />
        <TodoFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <Suspense fallback={<Spinner />}>
          <TodoList tasks={filteredTasks} />
        </Suspense>
      </div>
    </div>
  );
};
