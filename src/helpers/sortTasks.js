export const sortTasks = (tasks) => {
  return [...tasks].sort(
    (a, b) => Number(a.order) - Number(b.order) || Number(a.id) - Number(b.id)
  );
};
