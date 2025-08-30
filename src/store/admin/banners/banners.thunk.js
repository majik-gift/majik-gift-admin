import { createAsyncThunk } from '@reduxjs/toolkit';

import bannersApi from '@/apis/admin/banners/banners.api';

export const getBanners = createAsyncThunk('banner/get', async (userData, thunkAPI) => {
  try {
    const response = await bannersApi.getBanners(userData);
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
});

export const getSingleBanner = createAsyncThunk('singleBanner/get', async (userData, thunkAPI) => {
  try {
    const response = await bannersApi.getSingleBanner(userData.params);
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
});

export const createBanner = createAsyncThunk('createCategory', async (userData, thunkAPI) => {
  try {
    const response = await bannersApi.createBanner(userData);
    // if (response?.error) {
    //   const resError = new Error(response?.error.message);
    //   resError.code = response.error.code;
    //   resError.status = response.error.status;
    //   resError.data = response.error.data;
    //   throw resError;
    // }
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

export const updateBanner = createAsyncThunk('update-category', async (userData, thunkAPI) => {
  try {
    const response = await bannersApi.updateBanner(userData.params, userData.payload);
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

export const deleteBanner = createAsyncThunk('delete-category', async (userData, thunkAPI) => {
  try {
    const response = await bannersApi.deleteBanner(userData?.params);
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
