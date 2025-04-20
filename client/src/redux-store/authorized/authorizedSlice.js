// src/redux/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { checkAuthStatus, getAllUsers, getUser, loginUser, logOutUser, registerUser } from "./authorizedThunkFunctions";


const initialState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  isSeller: false,
  loading: false,
  error: null,
  users: [], 
};

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const authorizedSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.role === "admin";
        state.isSeller = action.payload.user.role === "seller";
        state.loading = false;
      })
      .addCase(registerUser.rejected, handleRejected)

      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.role === "admin";
        state.isSeller = action.payload.user.role === "seller";
        state.loading = false;
      })
      .addCase(loginUser.rejected, handleRejected)

      .addCase(logOutUser.pending, handlePending)
      .addCase(logOutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isAdmin = false;
        state.isSeller = false;
        state.loading = false;
      })
      .addCase(logOutUser.rejected, handleRejected)

      .addCase(getUser.pending, handlePending)
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAdmin = action.payload.role === "admin";
        state.isSeller = action.payload.role === "seller";
        state.loading = false;
      })
      .addCase(getUser.rejected, handleRejected)

      .addCase(checkAuthStatus.pending, handlePending)
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.user.role === "admin";
        state.isSeller = action.payload.user.role === "seller";
        state.loading = false;
      })
      .addCase(checkAuthStatus.rejected, handleRejected)
      .addCase(getAllUsers.pending, handlePending)
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload; // Update users state
        state.loading = false;
      })
      .addCase(getAllUsers.rejected, handleRejected);
  },
});

export const { resetError } = authorizedSlice.actions;
export default authorizedSlice.reducer;
