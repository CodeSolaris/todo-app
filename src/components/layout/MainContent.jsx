import { AddTodo } from "../todo-add/AddTodo";
import { Header } from "./Header";
import { TodoFilter } from "../todo-list/TodoFilter";
import { useState, lazy, Suspense, useMemo } from "react";
import { Spinner } from "../ui/Spinner";
import { useTodo } from "../../hooks/useTodo";
import { motion as Motion, AnimatePresence } from "framer-motion";

// Lazy load TodoList
const TodoList = lazy(() =>
  import("../todo-list/TodoList").then((module) => ({
    default: module.TodoList,
  }))
);

export const MainContent = () => {
  const { tasks } = useTodo();
  const [filter, setFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  }, [tasks, filter]);

  return (
    <div className="mx-auto flex flex-col gap-3 max-w-xl w-full h-full overflow-hidden">
      <div className="flex flex-col gap-3 shrink-0">
        <Header />
        <AddTodo />
        <TodoFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <Suspense fallback={<Spinner />}>
          <AnimatePresence mode="wait">
            <Motion.div
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TodoList tasks={filteredTasks} />
            </Motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
};
