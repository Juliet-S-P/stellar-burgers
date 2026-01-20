import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../services/store';
import { clearConstructor } from './constructorSlice';

type TOrderState = {
  orders: TOrder[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TOrderState = {
  orders: [],
  loading: false,
  error: null,
  orderModalData: null,
  orderRequest: false
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string; state: RootState }
>('order/create', async (ingredients, { rejectWithValue, dispatch }) => {
  try {
    const response = await orderBurgerApi(ingredients);

    if (!response.success) {
      return rejectWithValue('Ошибка при создании заказа');
    }

    dispatch(clearConstructor());

    return response.order;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка при создании заказа');
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
    addOrder: (state, action: PayloadAction<TOrder>) => {
      state.orders.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? action.error.message;
      });
  }
});

export const { clearOrder, addOrder } = orderSlice.actions;

export const getOrders = (state: RootState) => state.order.orders;
export const getOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const getOrderRequest = (state: RootState) => state.order.orderRequest;
export const getOrderError = (state: RootState) => state.order.error;

export default orderSlice.reducer;
