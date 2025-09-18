import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  tempOrder: null
};

const findExistingIndex = (products, payload) =>
  products.findIndex(item => item.id === payload.id && item.size === payload.size);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      // payload should include id, size (optional), etc.
      const idx = findExistingIndex(state.products, payload);
      if (idx !== -1) {
        state.products[idx].quantity += 1;
      } else {
        state.products.push({ ...payload, quantity: 1 });
      }
    },

    // removeItem accepts either id string OR object { id, size }
    removeItem: (state, { payload }) => {
      if (payload && typeof payload === 'object') {
        const { id, size } = payload;
        state.products = state.products.filter(item => !(item.id === id && item.size === size));
        if (state.tempOrder && state.tempOrder.id === id && state.tempOrder.size === size) {
          state.tempOrder = null;
        }
      } else {
        // payload is id string
        const id = payload;
        state.products = state.products.filter(item => item.id !== id);
        if (state.tempOrder && state.tempOrder.id === id) {
          state.tempOrder = null;
        }
      }
    },

    // increaseQuantity accepts either id string OR { id, size }
    increaseQuantity: (state, { payload }) => {
      if (payload && typeof payload === 'object') {
        const { id, size } = payload;
        const item = state.products.find(it => it.id === id && it.size === size);
        if (item) {
          item.quantity += 1;
          return;
        }
        if (state.tempOrder && state.tempOrder.id === id && (size === undefined || state.tempOrder.size === size)) {
          state.tempOrder.quantity = (state.tempOrder.quantity || 1) + 1;
        }
      } else {
        const id = payload;
        const item = state.products.find(it => it.id === id);
        if (item) {
          item.quantity += 1;
          return;
        }
        if (state.tempOrder && state.tempOrder.id === id) {
          state.tempOrder.quantity = (state.tempOrder.quantity || 1) + 1;
        }
      }
    },

    // decreaseQuantity accepts either id string OR { id, size }
    decreaseQuantity: (state, { payload }) => {
      if (payload && typeof payload === 'object') {
        const { id, size } = payload;
        const item = state.products.find(it => it.id === id && it.size === size);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
          return;
        }
        if (state.tempOrder && state.tempOrder.id === id && (size === undefined || state.tempOrder.size === size)) {
          if ((state.tempOrder.quantity || 1) > 1) {
            state.tempOrder.quantity -= 1;
          }
        }
      } else {
        const id = payload;
        const item = state.products.find(it => it.id === id);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
          return;
        }
        if (state.tempOrder && state.tempOrder.id === id) {
          if ((state.tempOrder.quantity || 1) > 1) {
            state.tempOrder.quantity -= 1;
          }
        }
      }
    },

    resetCart: () => initialState,

    setTempOrder: (state, { payload }) => {
      // ensure payload has quantity (default 1)
      state.tempOrder = { ...payload, quantity: payload.quantity || 1 };
    },

    clearTempOrder: (state) => {
      state.tempOrder = null;
    },

    updateTempOrder: (state, { payload }) => {
      if (!state.tempOrder) return;
      state.tempOrder = { ...state.tempOrder, ...payload };
    },

    // remove specific id+size (helper)
    removeItemByIdAndSize: (state, { payload }) => {
      const { id, size } = payload;
      state.products = state.products.filter(item => !(item.id === id && item.size === size));
      if (state.tempOrder && state.tempOrder.id === id && state.tempOrder.size === size) {
        state.tempOrder = null;
      }
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
  clearTempOrder,
  updateTempOrder,
  removeItemByIdAndSize
} = cartSlice.actions;

export default cartSlice.reducer;
