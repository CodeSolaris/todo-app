import { useCallback } from "react";
import { todoService } from "../services/todoService";
import {
  createTask,
  updateTaskById,
  replaceTempId,
  partitionTasksByCompleted,
  removeTaskById,
  findTaskById,
  batchDeleteTasks,
} from "../helpers/taskUtils";
import { useOnlineStatus } from "./useOnlineStatus";
import { useLocalStorage } from "./useLocalStorage";

export const useTaskOperations = (tasks, setTasks, setToLocalStorage) => {
  const { isOnline } = useOnlineStatus();
  const {
    getFromLocalStorage: getPendingDeletes,
    setToLocalStorage: setPendingDeletes,
  } = useLocalStorage("pending_deleted_todos");

  const addTask = useCallback(
    async (text, deadline) => {
      const newTask = createTask(text, deadline, tasks);

      if (!isOnline) {
        setTasks((prevTasks) => {
          const offlineTask = { ...newTask, synced: false };
          const updatedTasks = [...prevTasks, offlineTask];
          setToLocalStorage(updatedTasks);
          return updatedTasks;
        });
        return;
      }

      const tempId = newTask.id;
      setTasks((prevTasks) => [...prevTasks, newTask]);

      try {
        const createdTask = await todoService.create(newTask);
        setTasks((prevTasks) => {
          const syncTasks = replaceTempId(prevTasks, tempId, createdTask);
          setToLocalStorage(syncTasks);
          return syncTasks;
        });
      } catch (error) {
        console.error("Error adding todo:", error);
        setTasks((prevTasks) => removeTaskById(prevTasks, tempId));
      }
    },
    [tasks, setTasks, setToLocalStorage, isOnline]
  );

  const performUpdate = useCallback(
    async (id, updates) => {
      const task = findTaskById(tasks, id);
      if (!task) return;

      if (!isOnline) {
        const updatedTasks = updateTaskById(tasks, id, {
          ...updates,
          synced: false,
        });
        setTasks(updatedTasks);
        setToLocalStorage(updatedTasks);
        return;
      }

      const updatedTasks = updateTaskById(tasks, id, updates);
      setTasks(updatedTasks);

      try {
        const updatedTask = findTaskById(updatedTasks, id);
        await todoService.update(id, updatedTask);
        setToLocalStorage(updatedTasks);
      } catch (error) {
        console.error("Error updating task:", error);
        setTasks(tasks);
      }
    },
    [tasks, setTasks, setToLocalStorage, isOnline]
  );

  const toggleComplete = useCallback(
    (id) => {
      const task = findTaskById(tasks, id);
      if (task) {
        performUpdate(id, { completed: !task.completed });
      }
    },
    [tasks, performUpdate]
  );

  const updateTask = useCallback(
    (id, text, deadline) => {
      performUpdate(id, { text, deadline });
    },
    [performUpdate]
  );

  const deleteTask = useCallback(
    async (id) => {
      if (!isOnline) {
        const updatedTasks = removeTaskById(tasks, id);
        setTasks(updatedTasks);
        setToLocalStorage(updatedTasks);

        const pending = getPendingDeletes() || [];
        if (!pending.includes(id)) {
          setPendingDeletes([...pending, id]);
        }
        return;
      }

      const previousTasks = [...tasks];
      const updatedTasks = removeTaskById(tasks, id);
      setTasks(updatedTasks);

      try {
        await todoService.delete(id);
        setToLocalStorage(updatedTasks);
      } catch (error) {
        console.error("Error deleting todo:", error);
        setTasks(previousTasks);
      }
    },
    [
      tasks,
      setTasks,
      setToLocalStorage,
      isOnline,
      getPendingDeletes,
      setPendingDeletes,
    ]
  );

  const deleteCompletedTasks = useCallback(async () => {
    if (!isOnline) {
      const { completed, active } = partitionTasksByCompleted(tasks);
      setTasks(active);
      setToLocalStorage(active);

      const ids = completed.map((t) => t.id);
      const pending = getPendingDeletes() || [];
      const newPending = [...new Set([...pending, ...ids])];
      setPendingDeletes(newPending);
      return;
    }

    const previousTasks = [...tasks];
    const { completed: tasksToDelete, active: updatedTasks } =
      partitionTasksByCompleted(tasks);

    setTasks(updatedTasks);
    setToLocalStorage(updatedTasks);

    try {
      await batchDeleteTasks(tasksToDelete, todoService);
    } catch (error) {
      console.error("Error during batch delete:", error);
      setTasks(previousTasks);
    }
  }, [
    tasks,
    setTasks,
    setToLocalStorage,
    isOnline,
    getPendingDeletes,
    setPendingDeletes,
  ]);

  return {
    addTask,
    toggleComplete,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
  };
};
