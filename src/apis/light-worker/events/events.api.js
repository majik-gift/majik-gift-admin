import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/shared/services/apiService';

const eventsApi = {
  getEvents: (data) => apiGet(`events`, data),
  createEvent: (data) =>
    apiPost(`events`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateEvent: (params, data) =>
    apiPatch(`events/${params.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteEventImage: (params, data) =>
    apiDelete(`events/${params.id}/image?imageIndex=${params?.imageIndex}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getSingleEvent: (params) => apiGet(`events/${params.id}`),
  manageEventStatus: (params, data) => apiPut(`events/manage-status/${params.id}`, data),
  deleteEvent: (params, data) => apiDelete(`events/${params.id}`, data),
  inviteLightWorkers: (data) => apiPost(`events/invite-users`, data),
};

export default eventsApi;
