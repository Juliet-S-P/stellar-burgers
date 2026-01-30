import { rootReducer } from './rootReducer';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { orderSlice } from '../slices/orderSlice';
import { authSlice } from '../slices/authSlice';
import { feedSlice } from '../slices/feedSlice';
import { profileOrdersSlice } from '../slices/profileOrdersSlice';

describe('rootReducer', () => {
  it('should return the initial state when called with undefined state and unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    const expectedState = {
      ingredients: ingredientsSlice.getInitialState(),
      burgerConstructor: constructorSlice.getInitialState(),
      order: orderSlice.getInitialState(),
      auth: authSlice.getInitialState(),
      feed: feedSlice.getInitialState(),
      profileOrders: profileOrdersSlice.getInitialState()
    };
    
    expect(initialState).toEqual(expectedState);
  });

  it('should have correct initial state structure', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(Object.keys(initialState)).toEqual([
      'ingredients',
      'burgerConstructor',
      'order',
      'auth',
      'feed',
      'profileOrders'
    ]);

    expect(typeof initialState.ingredients).toBe('object');
    expect(typeof initialState.burgerConstructor).toBe('object');
    expect(typeof initialState.order).toBe('object');
    expect(typeof initialState.auth).toBe('object');
    expect(typeof initialState.feed).toBe('object');
    expect(typeof initialState.profileOrders).toBe('object');

    expect(initialState.ingredients).toHaveProperty('items');
    expect(initialState.ingredients).toHaveProperty('loading');
    expect(initialState.ingredients).toHaveProperty('error');
    expect(Array.isArray(initialState.ingredients.items)).toBe(true);
  });
});
