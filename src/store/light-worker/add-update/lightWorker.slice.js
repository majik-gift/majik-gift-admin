import { createSlice } from '@reduxjs/toolkit';

import { addLightWorker, getSingleLightWoker, updateLightWorker } from './lightWoker.thunk';

const lightWorkerSlice = createSlice({
  name: 'lightWorker',
  initialState: {
    singleLightWorker: null,
    singleLightWorkerLoading: false,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLightWorker.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLightWorker.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addLightWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLightWorker.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(updateLightWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLightWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSingleLightWoker.pending, (state, action) => {
        // state.loading = false;
        state.singleLightWorkerLoading = true;
      })
      .addCase(getSingleLightWoker.fulfilled, (state, action) => {
        state.singleLightWorker = action?.payload?.response?.details;
        // state.loading = false;
        state.success = action?.payload?.response?.message;
        state.singleLightWorkerLoading = false;
      })
      .addCase(getSingleLightWoker.rejected, (state, action) => {
        state.singleLightWorker = null;
        state.success = null;
        state.singleLightWorkerLoading = false;
      });
  },
});

// export const { clearSuccess, clearUserData, clearSingleProduct } = eventSlice.actions;

export default lightWorkerSlice.reducer;
