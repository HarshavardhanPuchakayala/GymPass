import api from "./axios";

export const getPlans = (gymId) =>
  api.get(`/gyms/${gymId}/plans`);

export const createPlan = (gymId, data) =>
  api.post(`/gyms/${gymId}/plans`, data);

export const updatePlan = (gymId, planId, data) =>
  api.put(`/gyms/${gymId}/plans/${planId}`, data);

export const deletePlan = (gymId, planId) =>
  api.delete(`/gyms/${gymId}/plans/${planId}`);