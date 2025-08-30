import { createAsyncThunk } from '@reduxjs/toolkit';

import dashboardAPI from '@/apis/dashboard/dashboard.api';

export const getAdminDashboard = createAsyncThunk(
  'getAdminDashboard',
  async (userData, thunkAPI) => {
    try {
      const response = await dashboardAPI.getAdminDashboard(userData);
      return response.response;
    } catch (error) {
      const errorDetails = {
        message: error.message || 'Login failed',
        code: error.code || 'UNKNOWN_ERROR',
        status: error?.status || 'UNKNOWN_STATUS',
        data: error?.data || null, // Include the response data if available
      };

      return thunkAPI.rejectWithValue(errorDetails);
    }
  }
);

export const getStallHolderDashboard = createAsyncThunk(
  'getStallHolderDashboard',
  async (userData, thunkAPI) => {
    try {
      const response = await dashboardAPI.getStallHolderDashboard(userData);
      return response.response;
    } catch (error) {
      const errorDetails = {
        message: error.message || 'Login failed',
        code: error.code || 'UNKNOWN_ERROR',
        status: error?.status || 'UNKNOWN_STATUS',
        data: error?.data || null, // Include the response data if available
      };

      return thunkAPI.rejectWithValue(errorDetails);
    }
  }
);

export const getLightWorkerDashboard = createAsyncThunk(
  'getLightWorkerDashboard',
  async (userData, thunkAPI) => {
    try {
      const response = await dashboardAPI.getLightWorkerDashboard(userData);
      return response.response;
    } catch (error) {
      const errorDetails = {
        message: error.message || 'Login failed',
        code: error.code || 'UNKNOWN_ERROR',
        status: error?.status || 'UNKNOWN_STATUS',
        data: error?.data || null, // Include the response data if available
      };

      return thunkAPI.rejectWithValue(errorDetails);
    }
  }
);
