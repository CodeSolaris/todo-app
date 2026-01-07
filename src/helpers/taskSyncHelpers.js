// Вычисляет новый порядок задач после перетаскивания
export const reorderTasks = (tasks, activeIndex, overIndex) => {
  if (activeIndex === overIndex || activeIndex === -1 || overIndex === -1) {
    return null;
  }

  const newTasks = [...tasks];
  const [taskToMove] = newTasks.splice(activeIndex, 1);
  newTasks.splice(overIndex, 0, taskToMove);

  return newTasks.map((task, index) => ({
    ...task,
    order: index + 1,
  }));
};

// Находит задачи, у которых изменился order
export const findChangedTasks = (updatedTasks, originalTasks) => {
  return updatedTasks.filter((task) => {
    const originalTask = originalTasks.find((t) => t.id === task.id);
    return originalTask && Number(originalTask.order) !== Number(task.order);
  });
};

// Синхронизирует задачи с сервером с задержкой между запросами
export const syncTasksToServer = async (tasks, todoService, delay = 300) => {
  for (const task of tasks) {
    if (String(task.id).startsWith("temp_")) continue;
    try {
      await todoService.update(task.id, task);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (err) {
      console.error(`Failed to sync task ${task.id}:`, err);
    }
  }
};

// Заменяет временный ID на серверный
export const replaceTempId = (tasks, tempId, serverTask) => {
  return tasks.map((task) => (task.id === tempId ? serverTask : task));
};
