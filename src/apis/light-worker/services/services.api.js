import { apiDelete, apiGet, apiPatch, apiPost } from "@/shared/services/apiService";

const servicesApi = {
  getServices: (userData) => apiGet("service", userData),
  getSingleService: (id) => apiGet(`service/${id}`),
  deleteServiceImage: (params, data) => apiDelete(`service/${params.id}/image?imageIndex=${params?.imageIndex}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  createService: (userData) => apiPost("service", userData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateService: ({ id }, payload) => apiPatch(`service/${id}`, payload,{ headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default servicesApi;
