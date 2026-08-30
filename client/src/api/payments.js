import api from "./axios";

export const getPayments = (gymId, memberId) =>
  api.get(`/gyms/${gymId}/members/${memberId}/payments`);

export const recordPayment = (gymId, memberId) =>
  api.post(`/gyms/${gymId}/members/${memberId}/payments`);