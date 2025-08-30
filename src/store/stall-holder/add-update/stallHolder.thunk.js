import { createAsyncThunk } from '@reduxjs/toolkit';;
import lightWokersApi from '@/apis/light-worker/add-update/lightWokers.api';



export const getSingleStallHolder = createAsyncThunk('stall-holder/:id', async (data, thunkAPI) => {
  try {
    const response = await lightWokersApi.getSingleLightWorker(data.params);
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

export const addStallHolder = createAsyncThunk('add-stall-holder', async (userData, thunkAPI) => {
  try {
    const response = await lightWokersApi.addLightWorker(userData);
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


export const updateStallHolder = createAsyncThunk('update-stall-holder', async (userData, thunkAPI) => {
  try {
    const response = await lightWokersApi.updateLightWorker(userData.params, userData.payload);
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