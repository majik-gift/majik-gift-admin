import { createAsyncThunk } from "@reduxjs/toolkit";

import settingsAPI from "@/apis/admin/settings/settings.api";


export const settingsGet = createAsyncThunk(
      'settings/get',
    async (userData, thunkAPI) => { 
        try {
            const response = await settingsAPI.getSettings(userData);
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


// update reading fees
export const updateReadingSettings = createAsyncThunk("updateReadingSettings", async (userData, thunkAPI) => {
    try {
      const response = await settingsAPI.updateReadingSetting(userData.params, userData.payload);
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


// shopItems Fees
export const updateShopItemsSettings = createAsyncThunk("updateShopItemsSettings", async (userData, thunkAPI) => {
    console.log("🚀 ~ updateSettings ~ userData:", userData)
    try {
      const response = await settingsAPI.updateShopItemsFees(userData.params, userData.payload);
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

// subscriptions fees
export const updateSubscriptionSettings = createAsyncThunk("updateSubscriptionSettings", async (userData, thunkAPI) => {
    try {
      const response = await settingsAPI.updateSubscriptionsFees(userData.params, userData.payload);
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

//   ticket sales Fees

export const updateTicketSettings = createAsyncThunk("updateTicketSettings", async (userData, thunkAPI) => {
    try {
      const response = await settingsAPI.updateTicketSalesFees(userData.params, userData.payload);
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


  //update tips percentage
export const updateTipsPercentage = createAsyncThunk("updateTicketPer", async (userData, thunkAPI) => {
    try {
      const response = await settingsAPI.updateTipsPercentage(userData.params, userData.payload);
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
