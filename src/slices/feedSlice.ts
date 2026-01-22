import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../services/store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  selectedOrder: TOrder | null;
  feedsLoading: boolean;
  orderLoading: boolean;
  error: string | null | undefined;
  wsConnected: boolean;
  wsError: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  selectedOrder: null,
  feedsLoading: false,
  orderLoading: false,
  error: null,
  wsConnected: false,
  wsError: null
};

export const WS_FEED_CONNECT = 'WS_FEED_CONNECT';
export const WS_FEED_DISCONNECT = 'WS_FEED_DISCONNECT';

export const connectFeedSocket = () => ({
  type: WS_FEED_CONNECT
});

export const disconnectFeedSocket = () => ({
  type: WS_FEED_DISCONNECT
});

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const feeds = await getFeedsApi();
    return feeds;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Неизвестная ошибка получения данных заказов');
  }
});

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feed/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders.length > 0) {
      return response.orders[0];
    }
    return rejectWithValue('Заказ не найден');
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue(
      'Неизвестная ошибка получения данных по номеру заказа'
    );
  }
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearFeedError: (state) => {
      state.error = null;
    },
    wsMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
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
      .addCase(fetchFeeds.pending, (state) => {
        state.feedsLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.feedsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.feedsLoading = false;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload ?? action.error.message;
      });
  }
});

export const {
  clearSelectedOrder,
  clearFeedError,
  wsMessage,
  wsConnectionChange,
  wsError
} = feedSlice.actions;

export const getFeeds = (state: RootState) => state.feed.orders;
export const getTotal = (state: RootState) => state.feed.total;
export const getTotalToday = (state: RootState) => state.feed.totalToday;
export const getSelectedOrder = (state: RootState) => state.feed.selectedOrder;
export const getFeedsLoading = (state: RootState) => state.feed.feedsLoading;
export const getOrderLoading = (state: RootState) => state.feed.orderLoading;
export const getFeedError = (state: RootState) => state.feed.error;
export const getWsConnected = (state: RootState) => state.feed.wsConnected;
export const getWsError = (state: RootState) => state.feed.wsError;

export const getSortedFeeds = createSelector([getFeeds], (orders) =>
  [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
);

export default feedSlice.reducer;
