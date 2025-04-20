import apiClient from "@/apiClient/apiClient";
import { createAsyncThunk } from "@reduxjs/toolkit";


// Admin: Get All Products
export const getAllProducts = createAsyncThunk(
  "admin/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/product/allProducts");
      return response.data.products || []; // Adjust based on your API response structure
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch all products with filters, sorting, and pagination
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ searchQuery, pageNo = 1, price = [0, 25000] }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/product/allProducts", {
        params: {
          search: searchQuery,
          page: pageNo,
          minPrice: price[0],
          maxPrice: price[1],
        },
      });
      return response.data; // Return serialized data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products.");
    }
  }
);

// Fetch product details by ID
export const fetchProductDetails = createAsyncThunk(
  "product/fetchProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/product/${productId}`);
      return response.data; // Return serialized data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details.");
    }
  }
);

// Create a new product (Admin or Seller)
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/product/createProduct", productData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Return serialized data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create product.");
    }
  }
);

// Fetch all listed products for a seller
export const sellerAllListedProducts = createAsyncThunk(
  "product/listedProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/product/listedProducts");
      return response.data.products; // Return serialized data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch seller's products.");
    }
  }
);

// Fetch all listed products for a seller
export const adminListedProducts = createAsyncThunk(
  "product/adminListedProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/product/adminProducts");
      return response.data.products; // Return serialized data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch seller's products.");
    }
  }
);

// Fetch specific product details for a seller
export const getProductDetails = createAsyncThunk(
  "seller/getProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/product/${productId}`);
      return response.data.product; // Return serialized data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details.");
    }
  }
);

// Update a product (Admin or Seller)
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/product/updateProduct/${productId}`, productData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Return serialized data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product.");
    }
  }
);

// Delete a product (Admin or Seller)
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/product/${productId}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      return { id: productId }; // Return the deleted product's ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product.");
    }
  }
);
