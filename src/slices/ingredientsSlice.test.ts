import { ingredientsSlice, fetchIngredients } from './ingredientsSlice';

describe('ingredientsSlice', () => {
  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun' as const,
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'image-url',
      image_mobile: 'image-mobile-url',
      image_large: 'image-large-url',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main' as const,
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'image-url',
      image_mobile: 'image-mobile-url',
      image_large: 'image-large-url',
      __v: 0
    }
  ];

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(ingredientsSlice.getInitialState()).toEqual({
        items: [],
        loading: false,
        error: null
      });
    });
  });

  describe('actions', () => {
    it('should handle clearIngredientsError', () => {
      const stateWithError = {
        items: [],
        loading: false,
        error: 'Some error'
      };

      const action = { type: 'ingredients/clearIngredientsError' };
      const state = ingredientsSlice.reducer(stateWithError, action);
      
      expect(state.error).toBeNull();
    });
  });

  describe('async thunk fetchIngredients', () => {
    it('should set loading to true and clear error on pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice.reducer(
        { items: [], loading: false, error: 'Previous error' },
        action
      );
      
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set loading to false and update items on fulfilled', () => {
      const action = { 
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice.reducer(
        { items: [], loading: true, error: null },
        action
      );
      
      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('should set loading to false and update error on rejected with payload', () => {
      const errorMessage = 'Network error';
      const action = { 
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const state = ingredientsSlice.reducer(
        { items: [], loading: true, error: null },
        action
      );
      
      expect(state.loading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });

    it('should set loading to false and update error on rejected with error message', () => {
      const errorMessage = 'Some error message';
      const action = { 
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsSlice.reducer(
        { items: [], loading: true, error: null },
        action
      );
      
      expect(state.loading).toBe(false);
      expect(state.items).toEqual([]);
      expect(state.error).toBe(errorMessage);
    });
  });
});
