// src/redux/order/authThunkFunctions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/apiClient/apiClient";

// Register User
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (credentials, { rejectWithValue }) => {
    // console.log(credentials);
    try {
      const response = await apiClient.post("/order/createOrder", credentials);
      console.log(response);
      return response.data;
    } catch (error) {
        // console.log(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Order creation failed");
    }
  }
);

// Admin get all orders
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/order/getAllOrders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// Seller get all orders
export const getSellerAllOrders = createAsyncThunk(
  "order/getSellerAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/order/getSellerOrders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch seller orders");
    }
  }
);

// User get all orders
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/order/allOrders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user orders");
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/order/updateOrderStatus/${orderId}`, { status });
      console.log("Order status updated successfully:", response.data);
      return response.data; // Success response
    } catch (error) {
      console.error("Failed to update order status:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);
