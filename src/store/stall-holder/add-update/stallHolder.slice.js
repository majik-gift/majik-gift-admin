import { createSlice } from '@reduxjs/toolkit';

import { addStallHolder, getSingleStallHolder, updateStallHolder } from './stallHolder.thunk';

const stallHolderSlice = createSlice({
  name: 'stallHolder',
  initialState: {
    singleStallHolder: null,
    singleStallHolderLoading: false,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addStallHolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStallHolder.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addStallHolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStallHolder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(updateStallHolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStallHolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSingleStallHolder.pending, (state, action) => {
        // state.loading = false;
        state.singleStallHolderLoading = true;
      })
      .addCase(getSingleStallHolder.fulfilled, (state, action) => {
        state.singleStallHolder = action?.payload?.response?.details;
        // state.loading = false;
        state.success = action?.payload?.response?.message;
        state.singleStallHolderLoading = false;
      })
      .addCase(getSingleStallHolder.rejected, (state, action) => {
        state.singleStallHolder = null;
        state.success = null;
        state.singleStallHolderLoading = false;
      });
  },
});

// export const { clearSuccess, clearUserData, clearSingleProduct } = eventSlice.actions;

export default stallHolderSlice.reducer;