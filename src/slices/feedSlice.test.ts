import { 
  feedSlice, 
  fetchFeeds, 
  clearSelectedOrder, 
  clearFeedError 
} from './feedSlice';

describe('feedSlice', () => {
  const mockOrder = {
    _id: '1',
    number: 12345,
    name: 'Test Order',
    ingredients: [],
    status: 'done' as const,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(feedSlice.getInitialState()).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        selectedOrder: null,
        feedsLoading: false,
        orderLoading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearSelectedOrder', () => {
      const stateWithOrder = {
        ...feedSlice.getInitialState(),
        selectedOrder: mockOrder
      };

      const action = clearSelectedOrder();
      const state = feedSlice.reducer(stateWithOrder, action);
      
      expect(state.selectedOrder).toBeNull();
    });

    it('should handle clearFeedError', () => {
      const stateWithError = {
        ...feedSlice.getInitialState(),
        error: 'Some error'
      };

      const action = clearFeedError();
      const state = feedSlice.reducer(stateWithError, action);
      
      expect(state.error).toBeNull();
    });
  });

  describe('async thunk fetchFeeds', () => {
    it('should set feedsLoading to true on pending', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedSlice.reducer(feedSlice.getInitialState(), action);
      
      expect(state.feedsLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update state on fulfilled', () => {
      const mockData = {
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      };

      const action = { 
        type: fetchFeeds.fulfilled.type,
        payload: mockData
      };
      const state = feedSlice.reducer(
        { ...feedSlice.getInitialState(), feedsLoading: true },
        action
      );
      
      expect(state.feedsLoading).toBe(false);
      expect(state.orders).toEqual(mockData.orders);
      expect(state.total).toBe(mockData.total);
      expect(state.totalToday).toBe(mockData.totalToday);
    });

    it('should update error on rejected', () => {
      const errorMessage = 'Network error';
      const action = { 
        type: fetchFeeds.rejected.type,
        payload: errorMessage
      };
      const state = feedSlice.reducer(
        { ...feedSlice.getInitialState(), feedsLoading: true },
        action
      );
      
      expect(state.feedsLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('WS actions', () => {
    it('should handle wsMessage', () => {
      const wsData = {
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      };
      
      const action = { 
        type: 'feed/wsMessage',
        payload: wsData
      };
      const state = feedSlice.reducer(feedSlice.getInitialState(), action);
      
      expect(state.orders).toEqual(wsData.orders);
      expect(state.total).toBe(wsData.total);
      expect(state.totalToday).toBe(wsData.totalToday);
      expect(state.wsError).toBeNull();
    });

    it('should handle wsConnectionChange', () => {
      const action = { 
        type: 'feed/wsConnectionChange',
        payload: true
      };
      const state = feedSlice.reducer(feedSlice.getInitialState(), action);
      
      expect(state.wsConnected).toBe(true);
    });

    it('should handle wsError', () => {
      const errorMessage = 'WebSocket error';
      const action = { 
        type: 'feed/wsError',
        payload: errorMessage
      };
      const state = feedSlice.reducer(feedSlice.getInitialState(), action);
      
      expect(state.wsError).toBe(errorMessage);
    });
  });
});
