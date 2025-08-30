import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/shared/services/apiService';

const servicesApi = {
  getServices: (data) => apiGet(`service`, data),
  getSingleService: (params) => apiGet(`service/${params.id}`),
  manageServiceStatus: (params, data) => apiPut(`service/manage-status/${params.id}`, data),
  deleteService: (params) => apiDelete(`service/${params.id}`),
  getServiceTimeSlots: (id) => apiGet(`service/${id}`),
  createTimeSlots: (payload) => apiPost(`time-slot`, payload),
  getTimeSlots: (params) => apiGet(`time-slot?serviceId=${params.id}&day=${params?.day}`),
  getSingleTimeSlots: ({ params }) => apiGet(`time-slot/${params.id}`),
  deleteTImeSlot: (params) => apiDelete(`time-slot/${params.id}`),
  updateTimeSlot: ({ params, payload }) => apiPatch(`time-slot/${params.id}`, payload),
  getOrders: (data) => apiGet('service-orders', data),
  getServiceOrderById: ({ params }) => apiGet(`service-orders/${params.id}`),
  getOrdersById: ({ params }) => apiGet(`service-orders?lightWorkerId[]=${params.id}`),
};

export default servicesApi;
