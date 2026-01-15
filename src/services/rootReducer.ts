import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { orderSlice } from '../slices/orderSlice';
import { feedSlice } from '../slices/feedSlice';
import { authSlice } from '../slices/authSlice';
import { profileOrdersSlice } from '../slices/profileOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  order: orderSlice.reducer,
  auth: authSlice.reducer,
  feed: feedSlice.reducer,
  profileOrders: profileOrdersSlice.reducer
});
