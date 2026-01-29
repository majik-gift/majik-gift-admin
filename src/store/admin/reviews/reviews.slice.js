import { createSlice } from '@reduxjs/toolkit';

import { reviewsGet, getSingleReview } from './reviews.thunk';

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    allReviews: null,
    singleReview: null,
    singleReviewLoading: false,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSingleReview.fulfilled, (state, action) => {
        state.singleReview = action?.payload?.details;
        state.singleReviewLoading = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(getSingleReview.pending, (state, action) => {
        state.singleReview = action?.payload?.details;
        state.singleReviewLoading = true;
        state.error = null;
        state.loading = true;
      })
      .addCase(getSingleReview.rejected, (state, action) => {
        state.singleReview = null;
        state.singleReviewLoading = false;
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(reviewsGet.fulfilled, (state, action) => {
        state.allReviews = action?.payload?.details;
        state.error = null;
        state.loading = false;
      })
      .addCase(reviewsGet.pending, (state, action) => {
        state.allReviews = action?.payload?.details;
        state.error = null;
        state.loading = true;
      })
      .addCase(reviewsGet.rejected, (state, action) => {
        state.allReviews = null;
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default reviewsSlice.reducer;

