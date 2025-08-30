import { createSlice } from "@reduxjs/toolkit";

import { getSingleServices, manageServiceStatus } from "./services.thunk";

const servicesSlice = createSlice({
  name: "service",
  initialState: {
    singleService: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearUserData: (state) => {
      state.singleService = null;
      state.loading = false;
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleServices.fulfilled, (state, action) => {
        state.singleService = action.payload?.response?.details;
        state.loading = false;
        state.success = action.payload?.response?.message;
      })
      .addCase(getSingleServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(manageServiceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(manageServiceStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = payload.message;
      })
      .addCase(manageServiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuccess, clearUserData } = servicesSlice.actions;

export default servicesSlice.reducer;
