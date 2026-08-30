import api from "./axios";

export const getMembers = (gymId) =>
  api.get(`/gyms/${gymId}/members`);

export const getMember = (gymId, memberId) =>
  api.get(`/gyms/${gymId}/members/${memberId}`);

export const createMember = (gymId, data) =>
  api.post(`/gyms/${gymId}/members`, data);

export const updateMember = (gymId, memberId, data) =>
  api.put(`/gyms/${gymId}/members/${memberId}`, data);

export const deleteMember = (gymId, memberId) =>
  api.delete(`/gyms/${gymId}/members/${memberId}`);