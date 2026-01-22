import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { createWebSocketMiddleware } from '../utils/websocket-middleware';

import { ingredientsSlice } from '../slices/ingredientsSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { orderSlice } from '../slices/orderSlice';
import { feedSlice } from '../slices/feedSlice';
import { authSlice } from '../slices/authSlice';
import { profileOrdersSlice } from '../slices/profileOrdersSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  order: orderSlice.reducer,
  auth: authSlice.reducer,
  feed: feedSlice.reducer,
  profileOrders: profileOrdersSlice.reducer
});

const webSocketMiddleware = createWebSocketMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'feed/wsMessage',
          'profileOrders/wsMessage',
          'WS_SEND'
        ],
        ignoredPaths: ['feed.orders', 'profileOrders.orders']
      }
    }).concat(webSocketMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
