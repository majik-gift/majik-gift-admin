import { apiGet } from '@/shared/services/apiService';

const dashboardAPI = {
  getAdminDashboard: (params, data) => apiGet(`auth/graph-dashBoard`, data),
  getLightWorkerDashboard: (params, data) => apiGet(`auth/graph-dashBoard`, data),
  getStallHolderDashboard: (params, data) => apiGet(`auth/graph-dashBoard`, data),
};

export default dashboardAPI;
