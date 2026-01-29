import { feedSlice, fetchFeeds } from './feedSlice';

describe('feedSlice', () => {
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
        selectedOrder: { _id: '1', number: 12345 } as any
      };

      const action = { type: 'feed/clearSelectedOrder' };
      const state = feedSlice.reducer(stateWithOrder, action);
      
      expect(state.selectedOrder).toBeNull();
    });

    it('should handle clearFeedError', () => {
      const stateWithError = {
        ...feedSlice.getInitialState(),
        error: 'Some error'
      };

      const action = { type: 'feed/clearFeedError' };
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
        orders: [{ _id: '1', number: 12345 }] as any,
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
  });
});
