import { createSlice } from '@reduxjs/toolkit';

import { createBanner } from './banners.thunk';

const bannersSlice = createSlice({
  name: 'banners',
  initialState: {
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
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createBanner.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default bannersSlice.reducer;
