// import { createSlice } from "@reduxjs/toolkit";

// import { login, me } from "./dashboard.thunks";
// import { storeLocalAccessToken } from "@/shared/helpers/authHelpers";
// import { createCookie } from "@/shared/helpers/cookies";

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     status: "idle",
//     error: null,
//     isLoggedIn: false,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//     setCurrentUser  : (state, action) => {
//       state.user = action.payload;
//     }
//   },
//   extraReducers: (builder) => {
//   //   builder

//   //     .addCase(login.fulfilled, (state, action) => {
//   //       state.status = "succeeded";
//   //       state.user = action.payload.details;
//   //       state.token = action.payload.access_token;
//   //       state.isLoggedIn = true;
//   //       storeLocalAccessToken(action.payload.access_token);
//   //       createCookie(
//   //         JSON.stringify({
//   //           access_token: action.payload.access_token,
//   //           user: {
//   //             role: action.payload.details.role,
//   //             stripe_status: action.payload.details.stripeConnectStatus,
//   //           },
//   //         })
//   //       );
//   //     })
//   //     .addCase(login.rejected, (state, action) => {
//   //       state.status = "failed";
//   //       state.error = action.payload;
//   //     })
//   //     .addCase(me.fulfilled, (state, action) => {
//   //       state.status = "succeeded";
//   //       state.user = action.payload.details;
//   //       state.isLoggedIn = true;
//   //       createCookie(
//   //         JSON.stringify({
//   //           access_token: action.payload.access_token,
//   //           user: {
//   //             role: action.payload.details.role,
//   //             stripe_status: action.payload.details.stripeConnectStatus,
//   //           },
//   //         })
//   //       );
//   //     })
//   //     .addCase(me.rejected, (state, action) => {
//   //       state.status = "failed";
//   //       state.error = action.payload;
//   //     });
//   // },
// });

// export const { logout ,setCurrentUser} = authSlice.actions;

// export default authSlice.reducer;
