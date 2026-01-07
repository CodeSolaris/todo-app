import { useCallback, useRef } from "react";
import { todoService } from "../services/todoService";
import { sortTasks } from "../helpers/taskHelpers";
import {
  reorderTasks,
  findChangedTasks,
  syncTasksToServer,
} from "../helpers/taskSyncHelpers";

export const useTasksSync = (tasks, setTasks, setToLocalStorage) => {
  const isSyncingRef = useRef(false);
  const syncTimeoutRef = useRef(null);

  const handleReorderTask = useCallback(
    async (taskId, overId) => {
      try {
        const currentTasks = sortTasks(tasks);

        const activeIndex = currentTasks.findIndex(
          (task) => task.id === taskId
        );
        const overIndex = currentTasks.findIndex((task) => task.id === overId);

        const updatedTasks = reorderTasks(currentTasks, activeIndex, overIndex);
        if (!updatedTasks) return;

        setTasks(updatedTasks);
        setToLocalStorage(updatedTasks);

        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

        syncTimeoutRef.current = setTimeout(async () => {
          isSyncingRef.current = true;

          const tasksToUpdate = findChangedTasks(updatedTasks, tasks);

          if (tasksToUpdate.length === 0) {
            isSyncingRef.current = false;
            return;
          }

          await syncTasksToServer(tasksToUpdate, todoService);

          isSyncingRef.current = false;
        }, 2000);
      } catch (error) {
        console.error("Error reordering task:", error);
      }
    },
    [tasks, setTasks, setToLocalStorage]
  );

  return { handleReorderTask, isSyncingRef };
};
