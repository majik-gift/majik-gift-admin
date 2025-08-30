import { createAsyncThunk } from '@reduxjs/toolkit';

import usersAPI from '@/apis/admin/users/users.api';

export const getUsers = createAsyncThunk('users', async (userData, thunkAPI) => {
  try {
    const response = await usersAPI.getUsers(userData);
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

export const getSingleUser = createAsyncThunk('users', async (userData, thunkAPI) => {
  try {
    const response = await usersAPI.getSingleUser(userData);
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

export const mangeUserStatus = createAsyncThunk('auth/manage-kyc', async (data, thunkAPI) => {
  try {
    const response = await usersAPI.mangeUserStatus(data.params, data.payload);
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

export const updateUser = createAsyncThunk('update-user', async (data, thunkAPI) => {
  try {
    const response = await usersAPI.updateUser(data.params, data.payload);
    if (response?.error) {
      const resError = new Error(response?.error.message);
      resError.code = response.error.code;
      resError.status = response.error.status;
      resError.data = response.error.data;
      throw resError;
    }
    return response;
  } catch (error) {
    // const errorDetails = {
    //   message: error.message || 'Login failed',
    //   code: error.code || 'UNKNOWN_ERROR',
    //   status: error?.status || 'UNKNOWN_STATUS',
    //   data: error?.data || null, // Include the response data if available
    // };

    return thunkAPI.rejectWithValue(error);
  }
});
