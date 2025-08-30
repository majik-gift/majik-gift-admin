import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/services/apiService';

const bannersApi = {
  getBanners: (data) => apiGet('admin/banner', data),
  createBanner: (data) =>
    apiPost(`admin/banner`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner: (params, data) =>
    apiPatch(`admin/banner/${params.id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getSingleBanner: (params) => apiGet(`admin/banner/${params.id}`),
  deleteBanner: (params, data) => apiDelete(`admin/banner/${params.id}`, data),
};

export default bannersApi;
