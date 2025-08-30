import servicesApi from '@/apis/services/services.api';
import { createAsyncThunk } from '@reduxjs/toolkit';

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

export const getSingleServices = createAsyncThunk('services', async (data, thunkAPI) => {
  try {
    const response = await servicesApi.getSingleService(data.params);
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

export const getTimeSlots = createAsyncThunk('getTimeSlots', async (data, thunkAPI) => {
  try {
    const { response } = await servicesApi.getTimeSlots(data);
    return response;
  } catch (error) {
    const errorDetails = {
      message: error.message || 'Login failed',
      code: error.code || 'UNKNOWN_ERROR',
      status: error?.status || 'UNKNOWN_STATUS',
      data: error?.data || null, // Include the response data if available
    }
    return thunkAPI.rejectWithValue(errorDetails);
  }
})
export const createTimeSlot = createAsyncThunk('createTimeSlot', async (data, thunkAPI) => {
  try {
    const response = await servicesApi.createTimeSlots(data);
    if (response?.error) {
      const resError = new Error(response?.error.message);
      resError.code = response.error.code;
      resError.status = response.error.status;
      resError.data = response.error.data;
      throw resError;
    } else {
      return response
    }
  } catch (error) {
    const errorDetails = {
      message: error.message || 'Login failed',
      code: error.code || 'UNKNOWN_ERROR',
      status: error?.status || 'UNKNOWN_STATUS',
      data: error?.data || null, // Include the response data if available
    }
    return thunkAPI.rejectWithValue(errorDetails);
  }
})


export const manageServiceStatus = createAsyncThunk('serviceStatus', async (data, thunkAPI) => {
  try {
    const response = await servicesApi.manageServiceStatus(data.params, data.payload);
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

export const deleteServices = createAsyncThunk('serviceStatus', async (data, thunkAPI) => {
  try {
    const response = await servicesApi.deleteService(data.params);
    return response;
  } catch (error) {
    console.log('🚀 ~ deleteServices ~ error:', error);
    // const errorDetails = {
    //   message: error.message || "Login failed",
    //   code: error.code || "UNKNOWN_ERROR",
    //   status: error?.status || "UNKNOWN_STATUS",
    //   data: error?.data || null, // Include the response data if available
    // };

    // return thunkAPI.rejectWithValue(errorDetails);
  }
});

export const getServiceOrdersHistoryById = createAsyncThunk(
  'service-orders/get',
  async (userData, thunkAPI) => {
    try {
      const response = await servicesApi.getOrdersById(userData);
      if (response?.error) {
        const resError = new Error(response?.error.message);
        resError.code = response.error.code;
        resError.status = response.error.status;
        resError.data = response.error.data;
        throw resError;
      }
      return response.response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
