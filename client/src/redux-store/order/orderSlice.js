import { createSlice } from "@reduxjs/toolkit";
import { createOrder, getAllOrders, getSellerAllOrders, getUserOrders } from "./orderThunkFunctions";

// Retrieve order from localStorage safely
const persistedOrder = JSON.parse(localStorage.getItem("order")) || null;

const initialState = {
  loading: false,
  error: null,
  orders: null,
  order: persistedOrder, // Initialize order from localStorage
};

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || "Something went wrong. Please try again.";
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null; // Clear any existing error
    },
    resetOrder: (state) => {
      state.order = null; // Reset order in state
      localStorage.removeItem("order"); // Clear order from localStorage
    },
    cashOnDelivery: (state) => {
      state.order = null; // Clear order from state if Cash on Delivery is selected
      localStorage.removeItem("order"); // Clear order from localStorage
    },
  },
  extraReducers: (builder) => {
    // Create Order cases
    builder
      .addCase(createOrder.pending, handlePending)
      .addCase(createOrder.fulfilled, (state, action) => {
        const { order, restCartItems } = action.payload;

        state.loading = false;
        state.error = null;
        state.order = order; // Store the order details

        // Persist order details in localStorage
        localStorage.setItem("order", JSON.stringify(order));

        // Retrieve existing cart data from localStorage
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Combine existing cart with restCartItems
        const updatedCart = [...existingCart, ...restCartItems];

        // Update the cart in localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        console.log("Order successfully created:", order);
      })
      .addCase(createOrder.rejected, handleRejected);

    // Get All Orders (Admin)
    builder
      .addCase(getAllOrders.pending, handlePending)
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders; // Set all orders from the response
      })
      .addCase(getAllOrders.rejected, handleRejected);

    // Get Seller Orders
    builder
      .addCase(getSellerAllOrders.pending, handlePending)
      .addCase(getSellerAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders; // Set seller orders from the response
      })
      .addCase(getSellerAllOrders.rejected, handleRejected);

    // Get User Orders
    builder
      .addCase(getUserOrders.pending, handlePending)
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders; // Set user orders from the response
      })
      .addCase(getUserOrders.rejected, handleRejected);
  },
});

export const { resetError, resetOrder, cashOnDelivery } = orderSlice.actions;
export default orderSlice.reducer;
