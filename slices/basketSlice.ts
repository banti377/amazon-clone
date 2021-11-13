import { createSlice } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addToBasket: (state, action) => {},
    removeFromBasket: (state, action) => {},
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state: RootStateOrAny) => state.basket.items;

export default basketSlice.reducer;
