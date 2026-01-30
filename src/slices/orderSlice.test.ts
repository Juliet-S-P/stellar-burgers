import { 
  orderSlice, 
  createOrder, 
  clearOrder, 
  addOrder 
} from './orderSlice';

describe('orderSlice', () => {
  const mockOrder = {
    _id: 'order-123',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
    status: 'done' as const,
    name: 'Space флюоресцентный бургер',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345
  };

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(orderSlice.getInitialState()).toEqual({
        orders: [],
        orderModalData: null,
        orderRequest: false,
        loading: false,
        error: null
      });
    });
  });

  describe('reducers', () => {
    it('should handle clearOrder', () => {
      const stateWithData = {
        orders: [],
        orderModalData: mockOrder,
        orderRequest: false,
        loading: false,
        error: 'Some error'
      };

      const action = clearOrder();
      const state = orderSlice.reducer(stateWithData, action);
      
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should handle addOrder', () => {
      const action = addOrder(mockOrder);
      const state = orderSlice.reducer(orderSlice.getInitialState(), action);
      
      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe('async thunk createOrder', () => {
    it('should set orderRequest to true and clear error on pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderSlice.reducer(
        { 
          orders: [], 
          orderModalData: null, 
          orderRequest: false, 
          loading: false,
          error: 'Previous error' 
        },
        action
      );
      
      expect(state.orderRequest).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set orderRequest to false and update orderModalData on fulfilled', () => {
      const action = { 
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderSlice.reducer(
        { 
          orders: [], 
          orderModalData: null, 
          orderRequest: true, 
          loading: false, 
          error: null 
        },
        action
      );
      
      expect(state.orderRequest).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    it('should set orderRequest to false and update error on rejected with payload', () => {
      const errorMessage = 'Недостаточно ингредиентов';
      const action = { 
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const state = orderSlice.reducer(
        { 
          orders: [], 
          orderModalData: null, 
          orderRequest: true, 
          loading: false, 
          error: null 
        },
        action
      );
      
      expect(state.orderRequest).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.orders).toHaveLength(0);
      expect(state.error).toBe(errorMessage);
    });

    it('should set orderRequest to false and update error on rejected with error message', () => {
      const errorMessage = 'Network error';
      const action = { 
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice.reducer(
        { 
          orders: [], 
          orderModalData: null, 
          orderRequest: true, 
          loading: false, 
          error: null 
        },
        action
      );
      
      expect(state.orderRequest).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.orders).toHaveLength(0);
      expect(state.error).toBe(errorMessage);
    });

    it('should maintain other state fields when orderRequest changes', () => {
      const initialState = {
        orders: [mockOrder],
        orderModalData: mockOrder,
        orderRequest: false,
        loading: false,
        error: null
      };

      const pendingAction = { type: createOrder.pending.type };
      const stateAfterPending = orderSlice.reducer(initialState, pendingAction);
      
      expect(stateAfterPending.orderRequest).toBe(true);
      expect(stateAfterPending.loading).toBe(false);
      expect(stateAfterPending.orders).toEqual(initialState.orders);
      expect(stateAfterPending.orderModalData).toEqual(initialState.orderModalData);
      expect(stateAfterPending.error).toBeNull();

      const newOrder = { ...mockOrder, number: 54321 };
      const fulfilledAction = { 
        type: createOrder.fulfilled.type,
        payload: newOrder
      };
      const stateAfterFulfilled = orderSlice.reducer(stateAfterPending, fulfilledAction);
      
      expect(stateAfterFulfilled.orderRequest).toBe(false);
      expect(stateAfterFulfilled.loading).toBe(false);
      expect(stateAfterFulfilled.orders).toHaveLength(2);
      expect(stateAfterFulfilled.orders[0]).toEqual(newOrder);
      expect(stateAfterFulfilled.orderModalData).toEqual(newOrder);
    });
  });
});
