import { apiGet, apiPatch, apiPut } from '@/shared/services/apiService';

const usersAPI = {
  getUsers: (data) => apiGet('users', data),
  getSingleUser: (data) => apiGet(`users/${data.id}`, data),
  mangeUserStatus: (params, data) => apiPut(`auth/manage-kyc/${params.id}`, data),
  updateUser: (params, data) => apiPatch(`users/${params.id}`, data),
};

export default usersAPI;
