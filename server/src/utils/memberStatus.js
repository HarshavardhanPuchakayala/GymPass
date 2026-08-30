export const getStatus = (dueDate) => {
  const due = new Date(dueDate);
  const today = new Date();

  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (due - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "upcoming";
  return "current";
};