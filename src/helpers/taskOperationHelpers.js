// Splits tasks into completed and active
export const partitionTasksByCompleted = (tasks) => {
  const completed = tasks.filter((task) => task.completed);
  const active = tasks.filter((task) => !task.completed);
  return { completed, active };
};

// Removes task by ID
export const removeTaskById = (tasks, id) => {
  return tasks.filter((task) => task.id !== id);
};

// Finds task by ID
export const findTaskById = (tasks, id) => {
  return tasks.find((task) => task.id === id);
};

// Performs batch deletion via API
export const batchDeleteTasks = async (tasks, todoService) => {
  return Promise.all(tasks.map((task) => todoService.delete(task.id)));
};
