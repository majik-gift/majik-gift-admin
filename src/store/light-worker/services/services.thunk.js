import servicesApi from '@/apis/light-worker/services/services.api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for login action
export const getServices = createAsyncThunk('services', async (userData, thunkAPI) => {
  try {
    const response = await servicesApi.getServices(userData);
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
});

export const getServiceById = createAsyncThunk('services', async (data, thunkAPI) => {
  try {
    const response = await servicesApi.getSingleService(data.params.id);
    return response;
  } catch (error) {
    const errorDetails = {
      message: error.message || 'Login failed',
      code: error.code || 'UNKNOWN_ERROR',
      status: error?.status || 'UNKNOWN_STATUS',
      data: error?.data || null, // Include the response data if available
    };

    return thunkAPI.rejectWithValue(errorDetails);
  }
});

export const createService = createAsyncThunk('services', async (userData, thunkAPI) => {
  try {
    const response = await servicesApi.createService(userData);

    if (response?.error) {
      const resError = new Error(response?.error.message);
      resError.code = response.error.code;
      resError.status = response.error.status;
      resError.data = response.error.data;
      throw resError;
    }
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
export const deleteServiceImage = createAsyncThunk(
  'delete-service-image',
  async (userData, thunkAPI) => {
    try {
      const response = await servicesApi.deleteServiceImage(userData.params, userData.payload);

      if (response?.error) {
        const resError = new Error(response?.error.message);
        resError.code = response.error.code;
        resError.status = response.error.status;
        resError.data = response.error.data;
        throw resError;
      }
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateService = createAsyncThunk('services', async (data, thunkAPI) => {
  try {
    const response = await servicesApi.updateService(data.params, data.payload);
    console.log('🚀 ~ updateService ~ response:', response);
    if (response?.error) {
      const resError = new Error(response?.error.message);
      resError.code = response.error.code;
      resError.status = response.error.status;
      resError.data = response.error.data;
      throw resError;
    }
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getTimeSlotsByServiceId = createAsyncThunk('services', async (data, thunkAPI) => {
  try {
    const response = await servicesApi.updateService(data.params, data.payload);
    return response;
  } catch (error) {
    const errorDetails = {
      message: error.message || 'Login failed',
      code: error.code || 'UNKNOWN_ERROR',
      status: error?.status || 'UNKNOWN_STATUS',
      data: error?.data || null, // Include the response data if available
    };

    return thunkAPI.rejectWithValue(errorDetails);
  }
});
