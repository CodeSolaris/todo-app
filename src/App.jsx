import { useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import ToggleTheme from "./components/ToggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";

const LOCAL_STORAGE_KEY = "todos";
export function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  const handleDeleteButton = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleAddTodo = (text, deadline) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline || null,
      order: tasks.length + 1,
    };
    const updatedTodos = [...tasks, newTask];
    setTasks(updatedTodos);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  const handleToggleComplete = (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };
    const updatedTasks = tasks.map((task) =>
      task.id === id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div
      data-theme={theme}
      className="flex flex-col items-center min-h-screen justify-center bg-page-light dark:bg-page-dark text-txt-light dark:text-txt-dark p-6"
    >
      <ToggleTheme theme={theme} toggleClick={() => toggleTheme(setTheme)} />
      <div className="mx-auto flex flex-col gap-3 max-w-xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-500">
            Todo App
          </span>
        </h1>
        <AddTodo onAddTodo={handleAddTodo} />

        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onDelete={handleDeleteButton}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
