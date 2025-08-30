import { createAsyncThunk } from '@reduxjs/toolkit';

import eventsApi from '@/apis/light-worker/events/events.api';

export const getEvents = createAsyncThunk('events', async (userData, thunkAPI) => {
  try {
    const response = await eventsApi.getEvents(userData);
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

export const getSingleEvent = createAsyncThunk('events/:id', async (data, thunkAPI) => {
  try {
    const response = await eventsApi.getSingleEvent(data.params);
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

export const createEvent = createAsyncThunk('events', async (userData, thunkAPI) => {
  try {
    const response = await eventsApi.createEvent(userData);
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
export const deleteEventImage = createAsyncThunk('delete-event-image', async (userData, thunkAPI) => {
  try {
    const response = await eventsApi.deleteEventImage(userData?.params, userData?.payload);
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

export const updateEvent = createAsyncThunk('update-event', async (userData, thunkAPI) => {
  try {
    const response = await eventsApi.updateEvent(userData.params, userData.payload);
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

export const inviteUsers = createAsyncThunk('invite', async (userData, thunkAPI) => {
  try {
    const response = await eventsApi.inviteLightWorkers(userData);
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

export const manageEventStatus = createAsyncThunk('eventStatus', async (data, thunkAPI) => {
  try {
    const response = await eventsApi.manageEventStatus(data.params, data.payload);
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

// export const deleteProductImage = createAsyncThunk("delete-product-image", async (userData, thunkAPI) => {
//   try {
//     const response = await eventsApi.deleteProductImage(userData.params, userData.payload);
//     if (response?.error) {
//       const resError = new Error(response?.error);
//       resError.code = response.error.code;
//       resError.status = response.error.status;
//       resError.data = response.error.data;
//       throw resError;
//     }
//     return response;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error);
//   }
// });

// export const deleteProduct = createAsyncThunk("delete-product", async (userData, thunkAPI) => {
//   console.log("🚀 ~ deleteProduct ~ userData:", userData)
//   try {
//     const response = await eventsApi.deleteProduct(userData?.params);
//     return response;
//   } catch (error) {
//     const errorDetails = {
//       message: error.message || "Login failed",
//       code: error.code || "UNKNOWN_ERROR",
//       status: error?.status || "UNKNOWN_STATUS",
//       data: error?.data || null, // Include the response data if available
//     };

//     return thunkAPI.rejectWithValue(errorDetails);
//   }
// });
