// Разделяет задачи на завершенные и незавершенные
export const partitionTasksByCompleted = (tasks) => {
  const completed = tasks.filter((task) => task.completed);
  const active = tasks.filter((task) => !task.completed);
  return { completed, active };
};

// Удаляет задачу по ID
export const removeTaskById = (tasks, id) => {
  return tasks.filter((task) => task.id !== id);
};

// Находит задачу по ID
export const findTaskById = (tasks, id) => {
  return tasks.find((task) => task.id === id);
};

// Выполняет batch удаление через API
export const batchDeleteTasks = async (tasks, todoService) => {
  return Promise.all(tasks.map((task) => todoService.delete(task.id)));
};
