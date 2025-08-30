import { createSlice } from '@reduxjs/toolkit';
import { getSingleUser, mangeUserStatus } from './users.thunks';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    userData: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearUserData: (state) => {
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.userData = action.payload?.details;
        state.loading = false;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(mangeUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mangeUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action?.payload?.message;
      })
      .addCase(mangeUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
