import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/services/apiService';

const reviewsApi = {
  getReviews: (data) => apiGet(`reviews`, data),
  getSingleReview: (params) => apiGet(`reviews/${params.id}`),
  createReview: (data) => apiPost(`reviews`, data),
  updateReview: (params, data) => apiPatch(`reviews/${params.id}`, data),
  deleteReview: (params, data) => apiDelete(`reviews/${params.id}`, data),
};

export default reviewsApi;

