import { createSlice } from '@reduxjs/toolkit';

import { categoriesGet, getSingleCategory } from './categories.thunk';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    allCategory: null,
    singleCategory: null,
    singleCategoryLoading: false,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    // clearUserData: (state) => {
    //   state.singleProduct = null;
    //   state.loading = false;
    //   state.error = null;
    // },
    // clearSuccess: (state) => {
    //   state.success = null;
    // },
    // clearSingleProduct : (state) => {
    //   state.singleProduct = null;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleCategory.fulfilled, (state, action) => {
        state.singleCategory = action?.payload?.details;
        state.singleCategoryLoading = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(getSingleCategory.pending, (state, action) => {
        state.singleCategory = action?.payload?.details;
        state.singleCategoryLoading = true;
        state.error = null;
        state.loading = true;
      })
      .addCase(getSingleCategory.rejected, (state, action) => {
        state.singleCategory = null;
        state.singleCategoryLoading = false;
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(categoriesGet.fulfilled, (state, action) => {
        state.allCategory = action?.payload?.details;
        state.error = null;
        state.loading = false;
      })
      .addCase(categoriesGet.pending, (state, action) => {
        state.allCategory = action?.payload?.details;
        state.error = null;
        state.loading = true;
      })
      .addCase(categoriesGet.rejected, (state, action) => {
        state.allCategory = null;
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
