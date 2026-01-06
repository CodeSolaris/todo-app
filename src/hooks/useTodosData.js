import { useEffect, useState, useCallback, useRef } from "react";
import { todoService } from "../services/todoService";

const LOCAL_STORAGE_KEY = "todos";

export const useTodosData = () => {
  const [tasks, setTasks] = useState([]);
  const isSyncingRef = useRef(false);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTodos) {
        const parsed = JSON.parse(savedTodos);
        setTasks(
          Array.isArray(parsed)
            ? [...parsed].sort(
                (a, b) =>
                  Number(a.order) - Number(b.order) ||
                  Number(a.id) - Number(b.id)
              )
            : []
        );
      }
      try {
        const serverTasks = await todoService.getAll();

        // Если в данный момент идет синхронизация порядка, не затираем локальные данные старыми с сервера
        if (isSyncingRef.current) return;

        const tasksWithLocalId = serverTasks
          .map((task) => ({
            ...task,
            localId: task.id,
          }))
          .sort(
            (a, b) =>
              Number(a.order) - Number(b.order) || Number(a.id) - Number(b.id)
          );

        console.log(
          "Tasks after sorting (UI order):",
          tasksWithLocalId.map((t) => `ID:${t.id}(Ord:${t.order})`)
        );

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
        order: Math.max(0, ...tasks.map((t) => t.order || 0)) + 1,
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);

      try {
        const createdTask = await todoService.create(newTask);
        setTasks((prevTasks) => {
          const syncTasks = prevTasks.map((task) =>
            task.localId === localId ? { ...createdTask, localId } : task
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncTasks));
          return syncTasks;
        });
      } catch (error) {
        console.error("Error adding todo:", error);
        setTasks((prevTasks) => prevTasks.filter((t) => t.localId !== localId));
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
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );

      try {
        await todoService.update(id, updatedTask);
        setTasks((prevTasks) => {
          const syncTasks = prevTasks.map((task) =>
            task.id === id ? updatedTask : task
          );
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncTasks));
          return syncTasks;
        });
      } catch (error) {
        console.error("Error toggling todo completion:", error);
        // Реверт стейта в случае ошибки
        const revertedTask = {
          ...taskToUpdate,
          completed: taskToUpdate.completed,
        };
        setTasks((prev) => prev.map((t) => (t.id === id ? revertedTask : t)));
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
  const handleReorderTask = useCallback(
    async (taskId, overId) => {
      try {
        const currentTasks = [...tasks].sort(
          (a, b) =>
            Number(a.order) - Number(b.order) || Number(a.id) - Number(b.id)
        );

        const activeIndex = currentTasks.findIndex(
          (task) => task.id === taskId
        );
        const overIndex = currentTasks.findIndex((task) => task.id === overId);

        if (activeIndex === overIndex || activeIndex === -1 || overIndex === -1)
          return;

        const newTasks = [...currentTasks];
        const [taskToMove] = newTasks.splice(activeIndex, 1);
        newTasks.splice(overIndex, 0, taskToMove);

        const updatedTasks = newTasks.map((task, index) => ({
          ...task,
          order: index + 1,
        }));

        // 1. Мгновенно обновляем UI и локальное хранилище
        setTasks(updatedTasks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));

        // 2. Откладываем отправку на сервер (Debounce), чтобы не спамить запросами
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

        syncTimeoutRef.current = setTimeout(async () => {
          isSyncingRef.current = true;

          // Определяем только те задачи, порядок которых изменился
          const tasksToUpdate = updatedTasks.filter((task) => {
            const originalTask = tasks.find((t) => t.id === task.id);
            return (
              originalTask && Number(originalTask.order) !== Number(task.order)
            );
          });

          if (tasksToUpdate.length === 0) {
            isSyncingRef.current = false;
            return;
          }

          console.log(
            `Syncing ${tasksToUpdate.length} changed tasks to server...`
          );

          for (const task of tasksToUpdate) {
            if (String(task.id).startsWith("temp_")) continue;
            try {
              await todoService.update(task.id, task);
              // Маленькая пауза, чтобы сервер не выдавал 503
              await new Promise((resolve) => setTimeout(resolve, 300));
            } catch (err) {
              console.error(`Failed to sync task ${task.id}:`, err);
            }
          }

          isSyncingRef.current = false;
          console.log("Server sync completed.");
        }, 2000);
      } catch (error) {
        console.error("Error reordering task:", error);
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
    handleReorderTask,
  };
};
