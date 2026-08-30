import api from "./axios";

export const getStaff = (gymId) =>
  api.get(`/gyms/${gymId}/staff`);

export const inviteStaff = (gymId, data) =>
  api.post(`/gyms/${gymId}/staff/invite`, data);