import { createAsyncThunk } from '@reduxjs/toolkit';

import productsApi from '@/apis/stall-holder/products/products.api';

export const getProducts = createAsyncThunk('products', async (userData, thunkAPI) => {
  try {
    const response = await productsApi.getProducts(userData);
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

export const getSingleProduct = createAsyncThunk('products/:id', async (data, thunkAPI) => {
  try {
    const response = await productsApi.getSingleProduct(data.params);
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

export const createProduct = createAsyncThunk('product', async (userData, thunkAPI) => {
  try {
    const response = await productsApi.createProduct(userData);
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

export const updateProduct = createAsyncThunk('update-product', async (userData, thunkAPI) => {
  try {
    const response = await productsApi.updateProduct(userData.params, userData.payload);
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

export const deleteProductImage = createAsyncThunk(
  'delete-product-image',
  async (userData, thunkAPI) => {
    console.log("🚀 ~ userData:", userData)
    try {
      const response = await productsApi.deleteProductImage(userData.params, userData.payload);
      if (response?.error) {
        const resError = new Error(response?.error);
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

export const deleteProduct = createAsyncThunk('delete-product', async (userData, thunkAPI) => {
  console.log('🚀 ~ deleteProduct ~ userData:', userData);
  try {
    const response = await productsApi.deleteProduct(userData?.params);
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

export const manageProductStatus = createAsyncThunk('productStatus', async (data, thunkAPI) => {
  try {
    const response = await productsApi.manageProductStatus(data.params, data.payload);
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
