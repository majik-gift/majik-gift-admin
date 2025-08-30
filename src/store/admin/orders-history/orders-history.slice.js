import { createSlice } from '@reduxjs/toolkit';

import { getSingleOrder } from './orders-history.thunk';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    allCategory: null,
    singleOrder: null,
    singleOrderLoading: false,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.singleOrder = action?.payload?.details;
        state.singleOrderLoading = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(getSingleOrder.pending, (state, action) => {
        state.singleOrder = action?.payload?.details;
        state.singleOrderLoading = true;
        state.error = null;
        state.loading = true;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.singleOrder = null;
        state.singleOrderLoading = false;
        state.error = action.payload;
        state.loading = false;
      });
    // .addCase(categoriesGet.fulfilled, (state, action) => {
    //   state.allCategory = action?.payload?.details;
    //   state.error = null;
    //   state.loading = false;
    // })
    // .addCase(categoriesGet.pending, (state, action) => {
    //   state.allCategory = action?.payload?.details;
    //   state.error = null;
    //   state.loading = true;
    // })
    // .addCase(categoriesGet.rejected, (state, action) => {
    //   state.allCategory = null;
    //   state.error = action.payload;
    //   state.loading = false;
    // });
  },
});

export default orderSlice.reducer;
