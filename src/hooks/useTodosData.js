import { useEffect, useState } from "react";
import { todoService } from "../services/todoService";
import { useLocalStorage } from "./useLocalStorage";
import { sortTasks } from "../helpers/taskHelpers";
import { useTaskOperations } from "./useTaskOperations";
import { useTasksSync } from "./useTasksSync";

export const useTodosData = () => {
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const [tasks, setTasks] = useState([]);

  const operations = useTaskOperations(tasks, setTasks, setToLocalStorage);
  const { handleReorderTask, isSyncingRef } = useTasksSync(
    tasks,
    setTasks,
    setToLocalStorage
  );

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = getFromLocalStorage();
      if (savedTodos) {
        setTasks(Array.isArray(savedTodos) ? sortTasks(savedTodos) : []);
      }
      try {
        const serverTasks = await todoService.getAll();

        if (isSyncingRef.current) return;

        const sortedTasks = sortTasks(serverTasks);

        setTasks(sortedTasks);
        setToLocalStorage(sortedTasks);
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };
    loadInitialData();
  }, [getFromLocalStorage, setToLocalStorage, isSyncingRef]);

  return {
    tasks,
    ...operations,
    handleReorderTask,
  };
};
