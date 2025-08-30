import { apiGet, apiPatch } from '@/shared/services/apiService';

const ordersHistoryApi = {
  getOrders: (data) => apiGet('orders', data),
  getSingleOrder: (params) => apiGet(`orders/${params.id}`),
  updateOrder: (params, data) => apiPatch(`orders/${params.id}`, data),
};

export default ordersHistoryApi;
