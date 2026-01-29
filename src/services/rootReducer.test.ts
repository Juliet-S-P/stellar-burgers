import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('should return the initial state when called with undefined state and unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    expect(initialState).toEqual({
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orders: [],
        orderModalData: null,
        orderRequest: false,
        loading: false,
        error: null
      },
      auth: {
        user: null,
        loading: false,
        error: null,
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false,
        authChecked: false
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        selectedOrder: null,
        feedsLoading: false,
        orderLoading: false,
        error: null,
        wsConnected: false,
        wsError: null
      },
      profileOrders: {
        orders: [],
        loading: false,
        error: null,
        wsConnected: false,
        wsError: null
      }
    });
  });
});
