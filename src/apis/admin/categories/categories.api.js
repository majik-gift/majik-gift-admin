import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/services/apiService';

const categoriesApi = {
  getCategories: (data, type) => apiGet(`category${data?.type ? `` : `?type=${type}`}`, data),
  getSingleCategory: (params) => apiGet(`category/${params.id}`),
  createCategory: (data) =>
    apiPost(`category`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCategory: (params, data) =>
    apiPatch(`category/${params.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCategory: (params, data) => apiDelete(`category/${params.id}`, data),
};

export default categoriesApi;
