// Pure business logic functions
export const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  const now = new Date();
  const due = new Date(dueDate);
  return due < now;
};

export const formatTaskDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
};

export const generateTaskSlug = (taskName) => {
  return taskName?.toLowerCase().replace(/\s+/g, "-") || "task";
};

export const getTaskStatus = (task) => {
  if (isTaskOverdue(task.due_date)) return "overdue";
  if (task.completed) return "completed";
  return "pending";
};