import { apiGet } from '@/shared/services/apiService';

const eventApi = {
  getOrdersHistory: (data) => apiGet(`event-ticket-orders`, data),
  getOrdersHistoryById: ({ params }) => apiGet(`event-ticket-orders?organizer_id[]=${params.id}`),
};

export default eventApi;
