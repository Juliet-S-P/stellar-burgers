import { profileOrdersSlice, fetchProfileOrders } from './profileOrdersSlice';

describe('profileOrdersSlice', () => {
  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(profileOrdersSlice.getInitialState()).toEqual({
        orders: [],
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearProfileOrders', () => {
      const stateWithOrders = {
        ...profileOrdersSlice.getInitialState(),
        orders: [{ _id: '1', number: 12345 }] as any
      };

      const action = { type: 'profileOrders/clearProfileOrders' };
      const state = profileOrdersSlice.reducer(stateWithOrders, action);
      
      expect(state.orders).toEqual([]);
    });

    it('should handle clearProfileOrdersError', () => {
      const stateWithError = {
        ...profileOrdersSlice.getInitialState(),
        error: 'Some error'
      };

      const action = { type: 'profileOrders/clearProfileOrdersError' };
      const state = profileOrdersSlice.reducer(stateWithError, action);
      
      expect(state.error).toBeNull();
    });
  });

  describe('async thunk fetchProfileOrders', () => {
    it('should set loading to true on pending', () => {
      const action = { type: fetchProfileOrders.pending.type };
      const state = profileOrdersSlice.reducer(
        profileOrdersSlice.getInitialState(), 
        action
      );
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update orders on fulfilled', () => {
      const mockOrders = [{ _id: '1', number: 12345 }] as any;

      const action = { 
        type: fetchProfileOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = profileOrdersSlice.reducer(
        { ...profileOrdersSlice.getInitialState(), loading: true },
        action
      );
      
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
    });
  });
});
