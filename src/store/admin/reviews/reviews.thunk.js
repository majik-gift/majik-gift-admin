import { createAsyncThunk } from '@reduxjs/toolkit';

import reviewsApi from '@/apis/admin/reviews/reviews.api';

export const reviewsGet = createAsyncThunk('reviews/get', async (data, thunkAPI) => {
  try {
    const response = await reviewsApi.getReviews(
      data?.userData ? data?.userData : data
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

export const getSingleReview = createAsyncThunk(
  'singleReview/get',
  async (userData, thunkAPI) => {
    try {
      const response = await reviewsApi.getSingleReview(userData.params);
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

export const createReview = createAsyncThunk('createReview', async (userData, thunkAPI) => {
  try {
    const response = await reviewsApi.createReview(userData);
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

export const updateReview = createAsyncThunk('updateReview', async (userData, thunkAPI) => {
  try {
    const response = await reviewsApi.updateReview(userData.params, userData?.payload);
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

export const deleteReview = createAsyncThunk('delete-review', async (userData, thunkAPI) => {
  try {
    const response = await reviewsApi.deleteReview(userData?.params);
    return response;
  } catch (error) {
    const errorDetails = {
      message: error.message || 'Delete failed',
      code: error.code || 'UNKNOWN_ERROR',
      status: error?.status || 'UNKNOWN_STATUS',
      data: error?.data || null,
    };

    return thunkAPI.rejectWithValue(errorDetails);
  }
});

