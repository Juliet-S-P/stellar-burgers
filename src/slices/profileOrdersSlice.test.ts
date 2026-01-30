import { 
  profileOrdersSlice, 
  fetchProfileOrders, 
  clearProfileOrders, 
  clearProfileOrdersError 
} from './profileOrdersSlice';

describe('profileOrdersSlice', () => {
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
        orders: [mockOrder]
      };

      const action = clearProfileOrders();
      const state = profileOrdersSlice.reducer(stateWithOrders, action);
      
      expect(state.orders).toEqual([]);
    });

    it('should handle clearProfileOrdersError', () => {
      const stateWithError = {
        ...profileOrdersSlice.getInitialState(),
        error: 'Some error'
      };

      const action = clearProfileOrdersError();
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
      const mockOrders = [mockOrder];

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

    it('should update error on rejected', () => {
      const errorMessage = 'Network error';
      const action = { 
        type: fetchProfileOrders.rejected.type,
        payload: errorMessage
      };
      const state = profileOrdersSlice.reducer(
        { ...profileOrdersSlice.getInitialState(), loading: true },
        action
      );
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('WS actions', () => {
    it('should handle wsMessage', () => {
      const wsData = {
        orders: [mockOrder]
      };
      
      const action = { 
        type: 'profileOrders/wsMessage',
        payload: wsData
      };
      const state = profileOrdersSlice.reducer(
        profileOrdersSlice.getInitialState(), 
        action
      );
      
      expect(state.orders).toEqual(wsData.orders);
      expect(state.wsError).toBeNull();
    });

    it('should handle wsConnectionChange', () => {
      const action = { 
        type: 'profileOrders/wsConnectionChange',
        payload: true
      };
      const state = profileOrdersSlice.reducer(
        profileOrdersSlice.getInitialState(), 
        action
      );
      
      expect(state.wsConnected).toBe(true);
    });

    it('should handle wsError', () => {
      const errorMessage = 'WebSocket error';
      const action = { 
        type: 'profileOrders/wsError',
        payload: errorMessage
      };
      const state = profileOrdersSlice.reducer(
        profileOrdersSlice.getInitialState(), 
        action
      );
      
      expect(state.wsError).toBe(errorMessage);
    });
  });
});
