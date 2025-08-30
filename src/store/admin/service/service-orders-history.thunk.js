import servicesApi from '@/apis/services/services.api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getServiceOrdersHistory = createAsyncThunk(
  'service-orders/get',
  async (userData, thunkAPI) => {
    try {
      const response = await servicesApi.getOrders(userData);
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
export const getWorkerOrderHistory = createAsyncThunk(
  'service-orders/:id',
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
export const getSingleServiceOrder = createAsyncThunk(
  'service-orders/:id',
  async (userData, thunkAPI) => {
    try {
      const response = await servicesApi.getServiceOrderById(userData);
      console.log("🚀 ~ response:", response)
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
