import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/shared/services/apiService';

const lightWokersApi = {
//   getEvents: (data) => apiGet(`events`, data),
  addLightWorker: (data) =>
    apiPost(`auth/create`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateLightWorker: (params, data) =>
    apiPatch(`users/${params.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
//   deleteEventImage: (params, data) =>
//     apiDelete(`events/${params.id}/image?imageIndex=${params?.imageIndex}`, data, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }),
  getSingleLightWorker: (params) => apiGet(`users/${params.id}`),
//   manageEventStatus: (params, data) => apiPut(`events/manage-status/${params.id}`, data),
//   deleteEvent: (params, data) => apiDelete(`events/${params.id}`, data),
//   inviteLightWorkers: (data) => apiPost(`events/invite-users`, data),
};

export default lightWokersApi;