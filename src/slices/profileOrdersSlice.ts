import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../services/store';

type TProfileOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null | undefined;
  wsConnected: boolean;
  wsError: string | null;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null,
  wsConnected: false,
  wsError: null
};

export const WS_PROFILE_ORDERS_CONNECT = 'WS_PROFILE_ORDERS_CONNECT';
export const WS_PROFILE_ORDERS_DISCONNECT = 'WS_PROFILE_ORDERS_DISCONNECT';

export const connectProfileOrdersSocket = () => ({
  type: WS_PROFILE_ORDERS_CONNECT
});

export const disconnectProfileOrdersSocket = () => ({
  type: WS_PROFILE_ORDERS_DISCONNECT
});

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Неизвестная ошибка при загрузке заказов профиля');
  }
});

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
    },
    clearProfileOrdersError: (state) => {
      state.error = null;
    },
    wsMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
      }>
    ) => {
      const sortedOrders = [...action.payload.orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      state.orders = sortedOrders;
      state.wsError = null;
    },
    wsConnectionChange: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.wsError = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      });
  }
});

export const {
  clearProfileOrders,
  clearProfileOrdersError,
  wsMessage,
  wsConnectionChange,
  wsError
} = profileOrdersSlice.actions;

export const getProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const getProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.loading;
export const getProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;
export const getProfileWsConnected = (state: RootState) =>
  state.profileOrders.wsConnected;
export const getProfileWsError = (state: RootState) =>
  state.profileOrders.wsError;

export const getSortedProfileOrders = createSelector(
  [getProfileOrders],
  (orders) =>
    [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
);

export default profileOrdersSlice.reducer;
