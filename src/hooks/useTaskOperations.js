import { useCallback } from "react";
import { todoService } from "../services/todoService";
import { createTask, updateTaskById } from "../helpers/taskHelpers";
import { replaceTempId } from "../helpers/taskSyncHelpers";
import {
  partitionTasksByCompleted,
  removeTaskById,
  findTaskById,
  batchDeleteTasks,
} from "../helpers/taskOperationHelpers";

export const useTaskOperations = (tasks, setTasks, setToLocalStorage) => {
  const addTask = useCallback(
    async (text, deadline) => {
      const newTask = createTask(text, deadline, tasks);
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
    [tasks, setTasks, setToLocalStorage]
  );

  const performUpdate = useCallback(
    async (id, updates) => {
      const task = findTaskById(tasks, id);
      if (!task) return;

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
    [tasks, setTasks, setToLocalStorage]
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
    [tasks, setTasks, setToLocalStorage]
  );

  const deleteCompletedTasks = useCallback(async () => {
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
  }, [tasks, setTasks, setToLocalStorage]);

  return {
    addTask,
    toggleComplete,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
  };
};
