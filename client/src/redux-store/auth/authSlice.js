// src/redux/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  // logoutUser,
  checkAuthStatus,
  getUser,
  logOutUser,
} from "./authThunkFunctions";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // register Reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login Reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        console.log("Login action payload:", action.payload);
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout Reducers
      .addCase(logOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null; // Clear the user data
        state.loading = false;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Reducer
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      })

      // Auth Check Reducers
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = AuthSlice.actions;
export default AuthSlice.reducer;
