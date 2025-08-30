import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/shared/services/apiService";

const productsApi = {
  getProducts: (data) => apiGet(`products`, data),
  createProduct: (data) => apiPost(`products`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateProduct: (params, data) => apiPatch(`products/${params.id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteProductImage: (params, data) => apiDelete(`products/${params.id}/image?imageIndex=${params?.imageIndex}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  getSingleProduct: (params) => apiGet(`products/${params.id}`),
  manageProductStatus: (params, data) => apiPut(`products/manage-status/${params.id}`, data),
  deleteProduct: (params, data) => apiDelete(`products/${params.id}`, data),
};

export default productsApi;
