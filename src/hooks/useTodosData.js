import { useEffect, useState, useCallback } from "react";
import { todoService } from "../services/todoService";

const LOCAL_STORAGE_KEY = "todos";

export const useTodosData = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTodos) {
        setTasks(JSON.parse(savedTodos));
      }
      try {
        const serverTasks = await todoService.getAll();
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

  const addTask = useCallback(
    async (text, deadline) => {
      const localId = `local_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 11)}`;
      const newTask = {
        id: `temp_${Date.now()}`,
        localId,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        deadline: deadline || null,
        order: tasks.length + 1,
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);

      try {
        const createdTask = await todoService.create(newTask);
        const syncTasks = updatedTasks.map((task) =>
          task.localId === localId ? { ...createdTask, localId } : task
        );
        setTasks(syncTasks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncTasks));
      } catch (error) {
        console.error("Error adding todo:", error);
        setTasks(tasks); // Revert
      }
    },
    [tasks]
  );

  const toggleComplete = useCallback(
    async (id) => {
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        completed: !taskToUpdate.completed,
      };
      const updatedTasks = tasks.map((task) =>
        task.id === id ? updatedTask : task
      );
      setTasks(updatedTasks);

      try {
        await todoService.update(id, updatedTask);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Error toggling todo completion:", error);
        setTasks(tasks); // Revert
      }
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (id, newText, newDeadline) => {
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        text: newText,
        deadline: newDeadline,
      };

      const updatedTasks = tasks.map((task) =>
        task.id === id ? updatedTask : task
      );
      setTasks(updatedTasks);

      try {
        await todoService.update(id, updatedTask);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Error editing task:", error);
        setTasks(tasks); // Revert
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id) => {
      const previousTasks = [...tasks];
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);

      try {
        await todoService.delete(id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Error deleting todo:", error);
        setTasks(previousTasks);
      }
    },
    [tasks]
  );

  const deleteCompletedTasks = useCallback(async () => {
    const previousTasks = [...tasks];
    const tasksToDelete = tasks.filter((task) => task.completed);
    const updatedTasks = tasks.filter((task) => !task.completed);

    setTasks(updatedTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));

    try {
      const results = await Promise.allSettled(
        tasksToDelete.map((task) => todoService.delete(task.id))
      );

      const failedIds = results
        .map((result, index) =>
          result.status === "rejected" ? tasksToDelete[index].id : null
        )
        .filter(Boolean);

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
  }, [tasks]);

  return {
    tasks,
    addTask,
    toggleComplete,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
  };
};
