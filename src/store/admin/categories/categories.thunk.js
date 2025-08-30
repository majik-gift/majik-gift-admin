import { createAsyncThunk } from '@reduxjs/toolkit';

import categoriesApi from '@/apis/admin/categories/categories.api';

export const categoriesGet = createAsyncThunk('categories/get', async (data, thunkAPI) => {
  try {
    const response = await categoriesApi.getCategories(
      data?.userData ? data?.userData : data,
      data?.type
    );
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

export const getSingleCategory = createAsyncThunk(
  'singleCategories/get',
  async (userData, thunkAPI) => {
    try {
      const response = await categoriesApi.getSingleCategory(userData.params);
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

export const createCategory = createAsyncThunk('createCategory', async (userData, thunkAPI) => {
  try {
    const response = await categoriesApi.createCategory(userData);
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

export const updateCategory = createAsyncThunk('updateCategory', async (userData, thunkAPI) => {
  try {
    const response = await categoriesApi.updateCategory(userData.params, userData?.payload);
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

export const deleteCategory = createAsyncThunk('delete-category', async (userData, thunkAPI) => {
  try {
    const response = await categoriesApi.deleteCategory(userData?.params);
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
