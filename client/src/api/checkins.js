import api from "./axios";

export const getCheckIns = (gymId, memberId) =>
  api.get(`/gyms/${gymId}/checkins`, {
    params: { memberId },
  });