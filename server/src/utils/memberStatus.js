// src/utils/memberStatus.js

export const getStatus = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (due < today) {
    return "overdue";
  }

  const threeDaysLater = new Date(today);
  threeDaysLater.setDate(today.getDate() + 3);

  if (due <= threeDaysLater) {
    return "upcoming";
  }

  return "current";
};

export const getDaysDifference = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const difference = due.getTime() - today.getTime();

  return Math.round(difference / (1000 * 60 * 60 * 24));
};