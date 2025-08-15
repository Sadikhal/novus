import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  tempOrder: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const existingItem = state.products.find(item => item.id === payload.id);
      existingItem 
        ? existingItem.quantity += 1 
        : state.products.push({ ...payload, quantity: 1 });
    },
    removeItem: (state, { payload }) => {
      state.products = state.products.filter(item => item.id !== payload);
    },
    increaseQuantity: (state, { payload }) => {
      const item = state.products.find(item => item.id === payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, { payload }) => {
      const item = state.products.find(item => item.id === payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    resetCart: () => initialState,
    setTempOrder: (state, { payload }) => {
      state.tempOrder = payload;
    },
    clearTempOrder: (state) => {
      state.tempOrder = null;
    }
  }
});

export const { 
  addToCart, 
  removeItem, 
  increaseQuantity, 
  decreaseQuantity, 
  resetCart,
  setTempOrder,
  clearTempOrder
} = cartSlice.actions;

export default cartSlice.reducer;