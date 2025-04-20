// src/redux/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/apiClient/apiClient";

// AsyncThunk: Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/register", credentials);
      localStorage.setItem("token", response.data.token); // Save token
      return response.data; // Contains user & token
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// AsyncThunk: Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/logIn", credentials);
      localStorage.setItem("token", response.data.token); // Save token
      console.log(response);
      return response.data; // Contains user & token
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// AsyncThunk: Login User
export const logOutUser = createAsyncThunk(
  "auth/logout",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/logout", credentials);
      localStorage.removeItem("token"); // Save token
      // console.log(response);
      return response.data; // Contains user & token
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// AsyncThunk: Get User
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/user/getUser");
      return response.data; // Contains user details
    } catch (error) {
      console.error("Get User Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  }
);

// AsyncThunk: Logout User
// export const logoutUser = createAsyncThunk("auth/logout", async () => {
//   localStorage.removeItem("token"); // Clear token
//   return null; // Reset user state
// });

// AsyncThunk: Check Authentication Status
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/user/profile");
      // console.log(response.data);
      return response.data; // Contains user info
    } catch (error) {
      console.error("Auth Check Error:", error.response?.data || error.message);
      localStorage.removeItem("token"); // Clear invalid token
      return rejectWithValue("Not authenticated");
    }
  }
);


// AsyncThunk: Update Address
export const updateAddress = createAsyncThunk(
  "auth/updateAddress",
  async (address, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/updateAddress", address);
      return response.data; // Contains updated address
    } catch (error) {
      console.error("Update Address Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

// AsyncThunk: Update Password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/updatePassword", passwordData);
      return response.data; // Return success data
    } catch (error) {
      console.error("Update Password Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to update password");
    }
  }
);
