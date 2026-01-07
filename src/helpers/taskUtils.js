/**
 * Task Utility Functions
 * Consolidates all task-related logic for creation, manipulation, validation and server sync.
 */

// --- Creation & Modification ---

const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

export const createTask = (text, deadline, currentTasks) => ({
  id: generateTempId(),
  text,
  completed: false,
  createdAt: new Date().toISOString(),
  deadline: deadline || null,
  order: Math.max(0, ...currentTasks.map((t) => t.order || 0)) + 1,
});

export const updateTaskById = (tasks, id, updates) =>
  tasks.map((task) => (task.id === id ? { ...task, ...updates } : task));

export const replaceTempId = (tasks, tempId, serverTask) =>
  tasks.map((task) => (task.id === tempId ? serverTask : task));

// --- Identification & Search ---

export const findTaskById = (tasks, id) => tasks.find((task) => task.id === id);

export const removeTaskById = (tasks, id) =>
  tasks.filter((task) => task.id !== id);

export const partitionTasksByCompleted = (tasks) => {
  const completed = tasks.filter((task) => task.completed);
  const active = tasks.filter((task) => !task.completed);
  return { completed, active };
};

// --- Sorting & Ordering ---

export const sortTasks = (tasks) => {
  return [...tasks].sort(
    (a, b) => Number(a.order) - Number(b.order) || Number(a.id) - Number(b.id)
  );
};

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

// --- Validation & Sanitization ---

export const isValidTask = (task) => {
  return (
    task &&
    (typeof task.id === "string" || typeof task.id === "number") &&
    typeof task.text === "string" &&
    typeof task.completed === "boolean"
  );
};

export const sanitizeTasks = (data) => {
  if (!Array.isArray(data)) return [];
  return data.filter(isValidTask);
};

// --- Sync & Server Operations ---

export const findChangedTasks = (updatedTasks, originalTasks) => {
  return updatedTasks.filter((task) => {
    const originalTask = originalTasks.find((t) => t.id === task.id);
    return originalTask && Number(originalTask.order) !== Number(task.order);
  });
};

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

export const batchDeleteTasks = async (tasks, todoService) => {
  return Promise.all(tasks.map((task) => todoService.delete(task.id)));
};
