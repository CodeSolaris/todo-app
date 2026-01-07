export const sortTasks = (tasks) => {
  return [...tasks].sort(
    (a, b) => Number(a.order) - Number(b.order) || Number(a.id) - Number(b.id)
  );
};

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
