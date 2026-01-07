import { useEffect, useState } from "react";
import { todoService } from "../services/todoService";
import { useLocalStorage } from "./useLocalStorage";
import { sortTasks } from "../helpers/taskHelpers";
import { useTaskOperations } from "./useTaskOperations";
import { useTasksSync } from "./useTasksSync";
import { useOnlineStatus } from "./useOnlineStatus";
import { useNotification } from "./useNotification";

export const useTodosData = () => {
  const { isOnline } = useOnlineStatus();
  const { showNotification } = useNotification();
  const { getFromLocalStorage, setToLocalStorage } = useLocalStorage();
  const {
    getFromLocalStorage: getPendingDeletes,
    setToLocalStorage: setPendingDeletes,
  } = useLocalStorage("pending_deleted_todos");

  const [tasks, setTasks] = useState(() => {
    const saved = getFromLocalStorage();
    return saved && Array.isArray(saved) ? sortTasks(saved) : [];
  });

  const operations = useTaskOperations(tasks, setTasks, setToLocalStorage);
  const { handleReorderTask, isSyncingRef } = useTasksSync(
    tasks,
    setTasks,
    setToLocalStorage
  );

  // Sync and fetch on online/reconnect
  useEffect(() => {
    const syncAndFetch = async () => {
      if (!isOnline) {
        showNotification("Работаем в оффлайн-режиме", "info");
        return;
      }

      if (isSyncingRef.current) return;

      try {
        const pendingDeletes = getPendingDeletes() || [];
        const localTasks = getFromLocalStorage() || [];
        const hasUnsynced =
          localTasks.some((t) => t.synced === false) ||
          pendingDeletes.length > 0;

        if (hasUnsynced) {
          showNotification("Синхронизация данных...", "info");
        }

        // 1. Sync pending deletes
        if (pendingDeletes.length > 0) {
          await Promise.all(
            pendingDeletes.map((id) =>
              todoService.delete(id).catch((e) => console.error(e))
            )
          );
          setPendingDeletes([]);
        }

        // 2. Sync pending additions/updates
        await Promise.all(
          localTasks.map(async (task) => {
            if (task.synced === false) {
              const cleanTask = { ...task };
              delete cleanTask.synced;

              try {
                if (String(task.id).startsWith("temp_")) {
                  delete cleanTask.id;
                  await todoService.create(cleanTask);
                } else {
                  await todoService.update(task.id, cleanTask);
                }
              } catch (e) {
                console.error("Error syncing task:", task.id, e);
              }
            }
          })
        );

        if (hasUnsynced) {
          showNotification("Данные синхронизированы", "success");
        }

        // 3. Fetch latest from server
        const serverTasks = await todoService.getAll();
        const sortedTasks = sortTasks(serverTasks);

        setTasks(sortedTasks);
        setToLocalStorage(sortedTasks);
      } catch (error) {
        console.error("Error syncing/loading todos:", error);
        showNotification("Ошибка при синхронизации", "error");
      }
    };

    syncAndFetch();
  }, [
    isOnline,
    getFromLocalStorage,
    setToLocalStorage,
    getPendingDeletes,
    setPendingDeletes,
    isSyncingRef,
    showNotification,
  ]);

  return {
    tasks,
    ...operations,
    handleReorderTask,
  };
};
