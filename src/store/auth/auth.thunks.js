import { createAsyncThunk } from '@reduxjs/toolkit';

import authAPI from '../../apis/auth/auth.api';

// Thunk for login action
export const login = createAsyncThunk('auth/sign-in', async (userData, thunkAPI) => {
  try {
    const response = await authAPI.login(userData);
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

export const connectStripe = createAsyncThunk('auth/connect-stripe', async (userData, thunkAPI) => {
  try {
    const response = await authAPI.connectStripe(userData);
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

export const checkStripeStatus = createAsyncThunk(
  'auth/check-stripe-status',
  async (userData, thunkAPI) => {
    try {
      const response = await authAPI.checkStripeStatus(userData);
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

export const forgetPass = createAsyncThunk('auth/forget-password', async (userData, thunkAPI) => {
  try {
    const response = await authAPI.forgetPass(userData);
    console.log('🚀 ~ forgetPass ~ response:', response);
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

export const verifyOtp = createAsyncThunk('auth/verify-otp', async (userData, thunkAPI) => {
  try {
    const response = await authAPI.verifyOtp(userData);
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

export const resetPassword = createAsyncThunk('auth/reset-password', async (userData, thunkAPI) => {
  try {
    const response = await authAPI.resetPassword(userData);
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

export const resendOtp = createAsyncThunk('auth/resend-otp', async (userData, thunkAPI) => {
  try {
    const response = await authAPI.resendOtp(userData);
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

export const me = createAsyncThunk('auth/me', async (userData, thunkAPI) => {
  try {
    const response = await authAPI.userInfo(userData);
    if (response?.error) {
      const resError = new Error(response?.error.message);
      resError.code = response.error.code;
      resError.status = response.error.status;
      resError.data = response.error.data;
      throw resError;
    }
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
