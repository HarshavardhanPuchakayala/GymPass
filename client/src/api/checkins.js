import api from "./axios";

export const checkInMember = (gymId, memberId) => {
  return api.post(`/gyms/${gymId}/checkins`, {
    memberId,
  });
};

export const getCheckIns = (gymId, memberId) =>
  api.get(`/gyms/${gymId}/checkins`, {
    params: { memberId },
  });