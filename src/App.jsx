import { useEffect, useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import ToggleTheme from "./components/ToggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";

const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://69583b896c3282d9f1d4a368.mockapi.io/api/v1/todos";

export function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTodos) {
        setTasks(JSON.parse(savedTodos));
      }
      try {
        const response = await fetch(API_URL);
        const serverTasks = await response.json();
        setTasks(serverTasks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverTasks));
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    loadInitialData();
  }, []);

  const handleDeleteButton = async (id) => {
    const previousTasks = [...tasks];
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error deleting todo:", error);
      setTasks(previousTasks);
    }
  };

  const handleAddTodo = async (text, deadline) => {
    const newTask = {
      id: `temp_${Date.now()}`,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline || null,
      order: tasks.length + 1,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const createdTask = await response.json();
      const syncTasks = updatedTasks.map((task) =>
        task.id === newTask.id ? createdTask : task
      );
      setTasks(syncTasks);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncTasks));
    } catch (error) {
      console.error("Error adding todo:", error);
      setTasks(tasks);
    }
  };

  const handleToggleComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const updatedTask = {
      ...taskToUpdate,
      completed: !taskToUpdate.completed,
    };
    const updatedTasks = tasks.map((task) =>
      task.id === id ? updatedTask : task
    );
    setTasks(updatedTasks);

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error toggling todo completion:", error);
    }
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
