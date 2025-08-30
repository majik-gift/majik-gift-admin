import { createSlice } from '@reduxjs/toolkit';

import {
  getSingleProduct,
  manageProductStatus,
  createProduct,
  updateProduct,
  } from './products.thunk';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    singleProduct: null,
    singleProductLoading: false,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearUserData: (state) => {
      state.singleProduct = null;
      state.loading = false;
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSingleProduct: (state) => {
      state.singleProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleProduct.pending, (state) => {
        // state.loading = true;
        state.singleProductLoading = true;
        state.error = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.singleProduct = action?.payload?.response?.details;
        // state.loading = false;
        state.success = action?.payload?.response?.message;
        state.singleProductLoading = false;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // For Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // For Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // For Manage Product Status
      .addCase(manageProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageProductStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = payload.message;
      })
      .addCase(manageProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuccess, clearUserData, clearSingleProduct, clearError } = productSlice.actions;

export default productSlice.reducer;
