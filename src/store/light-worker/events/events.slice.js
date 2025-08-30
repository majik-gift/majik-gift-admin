import { createSlice } from '@reduxjs/toolkit';

import { createEvent, getSingleEvent } from './events.thunk';

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    singleEvent: null,
    singleEventLoading: false,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSingleEvent.pending, (state, action) => {
        // state.loading = false;
        state.singleEventLoading = true;
      })
      .addCase(getSingleEvent.fulfilled, (state, action) => {
        state.singleEvent = action?.payload?.response?.details;
        // state.loading = false;
        state.success = action?.payload?.response?.message;
        state.singleEventLoading = false;
      })
      .addCase(getSingleEvent.rejected, (state, action) => {
        state.singleEvent = null;
        state.success = null;
        state.singleEventLoading = false;
      });
  },
});

// export const { clearSuccess, clearUserData, clearSingleProduct } = eventSlice.actions;

export default eventSlice.reducer;
