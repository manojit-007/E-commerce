// src/redux/auth/authThunkFunctions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/apiClient/apiClient";
import { tokenManager } from "@/utils/tokenManager";

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/register", credentials);
      tokenManager.saveToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/logIn", credentials);
      console.log(response.data);
      tokenManager.saveToken(response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Logout User
export const logOutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/logout");
      tokenManager.clearToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Get User Details
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/user/getUser");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  }
);

// Check Authentication Status
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/user/profile");
      return response.data;
    } catch (error) {
        // console.log(error);
        const message = error.message || "Not authenticated";
      tokenManager.clearToken();
      return rejectWithValue(message);
    }
  }
);

// admin 
// Get All Users
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/user/admin/allUsers");
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);
