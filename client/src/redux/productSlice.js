import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  allProducts: [],
  pagination: {
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 30,
  }
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    ProductsStart: (state) => {
      state.isLoading = true;
      state.error = null; // Clear previous errors
    },
    ProductsSuccess: (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload.products;
      state.pagination = action.payload.pagination || {
        totalProducts: action.payload.products.length,
        totalPages: 1,
        currentPage: 1,
        limit: 30,
      };
    },
    ProductsFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.allProducts = []; // Clear products on error
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  ProductsStart,
  ProductsSuccess,
  ProductsFailed,
  clearErrors,
} = productSlice.actions;

export default productSlice.reducer;