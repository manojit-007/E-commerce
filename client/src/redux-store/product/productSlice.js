import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  fetchProductDetails,
  fetchProducts,
  sellerAllListedProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getAllProducts,
  adminListedProducts,
} from "./productThunkFunctions";

const initialState = {
  loading: false,
  error: null,
  products: [],
  productDetails: null,
  productCount: 0,
  totalPages: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pendingReducer = (state) => {
      state.loading = true;
      state.error = null;
    };

    const rejectedReducer = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Fetch Products
      .addCase(fetchProducts.pending, pendingReducer)
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { products, productCount, totalPages } = action.payload;
        state.products = products;
        state.productCount = productCount;
        state.totalPages = totalPages;
      })
      .addCase(fetchProducts.rejected, rejectedReducer)

      // Fetch Product Details
      .addCase(fetchProductDetails.pending, pendingReducer)
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, rejectedReducer)

      // Create Product
      .addCase(createProduct.pending, pendingReducer)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload); // Add new product at the top
      })
      .addCase(createProduct.rejected, rejectedReducer)

      // Update Product
      .addCase(updateProduct.pending, pendingReducer)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        state.products = state.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(updateProduct.rejected, rejectedReducer)

      // Delete Product
      .addCase(deleteProduct.pending, pendingReducer)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedProductId = action.payload._id; // Adjust based on your API
        state.products = state.products.filter(
          (product) => product._id !== deletedProductId
        );
      })
      .addCase(deleteProduct.rejected, rejectedReducer)

      // Seller All Listed Products
      .addCase(sellerAllListedProducts.pending, pendingReducer)
      .addCase(sellerAllListedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Set seller's products
      })
      .addCase(sellerAllListedProducts.rejected, rejectedReducer)
      // Admin All Listed Products
      .addCase(adminListedProducts.pending, pendingReducer)
      .addCase(adminListedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Set seller's products
      })
      .addCase(adminListedProducts.rejected, rejectedReducer)

      // Admin: All Products
      .addCase(getAllProducts.pending, pendingReducer)
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Set all products
      })
      .addCase(getAllProducts.rejected, rejectedReducer)

      // Get Product Details (Seller)
      .addCase(getProductDetails.pending, pendingReducer)
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(getProductDetails.rejected, rejectedReducer);
  },
});

export const { resetError } = productSlice.actions;
export default productSlice.reducer;
