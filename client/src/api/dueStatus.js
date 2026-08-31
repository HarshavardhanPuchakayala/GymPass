import api from "./axios";

export const getMembersByDueStatus = (gymId, status = "overdue") => {
  return api.get(`/gyms/${gymId}/members/due-status`, {
    params: { status },
  });
};