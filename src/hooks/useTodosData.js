import { useEffect, useState } from "react";
import { todoService } from "../services/todoService";
import { useLocalStorage } from "./useLocalStorage";
import { sortTasks, sanitizeTasks } from "../helpers/taskHelpers";
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
    const sanitized = sanitizeTasks(saved);
    return sortTasks(sanitized);
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
        showNotification("Working in offline mode", "info");
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
          showNotification("Syncing data...", "info");
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
          showNotification("Data synchronized", "success");
        }

        // 3. Fetch latest from server
        const serverTasks = await todoService.getAll();
        const sanitizedServerTasks = sanitizeTasks(serverTasks);
        const sortedTasks = sortTasks(sanitizedServerTasks);

        setTasks(sortedTasks);
        setToLocalStorage(sortedTasks);
      } catch (error) {
        console.error("Error syncing/loading todos:", error);
        showNotification("Error during synchronization", "error");
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
