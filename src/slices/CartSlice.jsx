import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // array of { id, name, image, price, description, qty }
  },
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload; // plant object passed from handleAddToCart
      const existing = state.items.find((item) => item.id === newItem.id);

      if (existing) {
        // If already in cart, increment quantity
        existing.qty += newItem.qty || 1;
      } else {
        // If not in cart, add new item
        state.items.push({ ...newItem, qty: newItem.qty || 1 });
      }
    },

    removeItem: (state, action) => {
      // action.payload is the id of the plant to remove
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    updateQuantity: (state, action) => {
      // action.payload = { id, qty }
      const { id, qty } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.qty = qty;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = CartSlice.actions;
export default CartSlice.reducer;
