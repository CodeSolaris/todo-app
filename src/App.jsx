import { useEffect, useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import ToggleTheme from "./components/ToggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://69583b896c3282d9f1d4a368.mockapi.io/api/v1/todos";

export function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const hasCompletedTasks = tasks.some((task) => task.completed);
  const [isDeleteCompletedModalOpen, setIsDeleteCompletedModalOpen] =
    useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTodos) {
        setTasks(JSON.parse(savedTodos));
      }
      try {
        const response = await fetch(API_URL);
        const serverTasks = await response.json();

        const tasksWithLocalId = serverTasks.map((task) => ({
          ...task,
          localId: task.id,
        }));
        setTasks(tasksWithLocalId);
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(tasksWithLocalId)
        );
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    loadInitialData();
  }, []);

  const handleDeleteTask = async (id) => {
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
    const localId = `local_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newTask = {
      id: `temp_${Date.now()}`,
      localId, // Stable ID for React key
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
      // Update data but keep localId to prevent React from recreating the component
      const syncTasks = updatedTasks.map((task) =>
        task.localId === localId ? { ...createdTask, localId } : task
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

  const handleDeleteCompletedTasks = async () => {
    const previousTasks = [...tasks];
    const tasksToDelete = tasks.filter((task) => task.completed);
    const updatedTasks = tasks.filter((task) => !task.completed);

    setTasks(updatedTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));

    try {
      const results = await Promise.allSettled(
        tasksToDelete.map((task) =>
          fetch(`${API_URL}/${task.id}`, {
            method: "DELETE",
          }).then((res) => {
            if (!res.ok) throw new Error("Failed to delete");
            return task.id;
          })
        )
      );

      const failedIds = results
        .filter((result) => result.status === "rejected")
        .map((_, index) => tasksToDelete[index].id);

      if (failedIds.length > 0) {
        console.error("Failed to delete tasks with IDs:", failedIds);
        const restoredTasks = [
          ...updatedTasks,
          ...previousTasks.filter((task) => failedIds.includes(task.id)),
        ].sort((a, b) => a.order - b.order);

        setTasks(restoredTasks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(restoredTasks));
      }
    } catch (error) {
      console.error("Unexpected error during batch delete:", error);
      setTasks(previousTasks);
    }
  };

  return (
    <div
      data-theme={theme}
      className="flex flex-col items-center min-h-screen justify-center bg-page-light dark:bg-page-dark text-txt-light dark:text-txt-dark p-6"
    >
      <ToggleTheme theme={theme} onToggle={() => toggleTheme(setTheme)} />
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
              key={task.localId || task.id}
              task={task}
              onDelete={() => {
                setIsDeleteModalOpen(true);
                setDeleteTaskId(task.id);
              }}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            handleDeleteTask(deleteTaskId);
            setIsDeleteModalOpen(false);
          }}
          message="Are you sure you want to delete this task?"
        />
      )}
      {isDeleteCompletedModalOpen && (
        <DeleteConfirmModal
          onCancel={() => setIsDeleteCompletedModalOpen(false)}
          onConfirm={() => {
            handleDeleteCompletedTasks();
            setIsDeleteCompletedModalOpen(false);
          }}
          message={`Are you sure you want to delete all ${
            tasks.filter((task) => task.completed).length
          } completed tasks?`}
        />
      )}
      {hasCompletedTasks && (
        <button
          className="px-4 py-2 mt-4 rounded-lg  bg-red-500 hover:bg-red-600 text-white transition-colors duration-300 cursor-pointer"
          type="button"
          onClick={() => {
            setIsDeleteCompletedModalOpen(true);
          }}
        >
          Delete completed tasks
        </button>
      )}
    </div>
  );
}
