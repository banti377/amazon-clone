import { createSlice } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';

import { IProduct } from '../interfaces';

interface InitialStateProps {
  products: IProduct[];
}

const initialState: InitialStateProps = {
  products: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: { type: string; payload: IProduct }) => {
      state.products = [...state.products, action.payload];
    },
    removeFromCart: (state, action: { type: string; payload: number }) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );

      let newCart = [...state.products];

      if (index >= 0) {
        newCart.splice(index, 1);
      } else {
        console.warn(
          `Can not remove product (id: ${action.payload}) as its not in cart!`
        );
      }

      state.products = newCart;
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectProducts = (state: RootStateOrAny) => state.cart.products;
export const selectTotal = (state: RootStateOrAny) =>
  state.cart.products.reduce(
    (total: number, product: IProduct) => total + parseInt(product.price),
    0
  );

export default cartSlice.reducer;
