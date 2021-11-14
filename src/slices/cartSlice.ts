import { createSlice } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {},
    removeCart: (state, action) => {},
  },
});

export const { addToCart, removeCart: removeFromCart } = cartSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state: RootStateOrAny) => state.cart.items;

export default cartSlice.reducer;
