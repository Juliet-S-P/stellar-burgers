import { constructorSlice, initialState } from './constructorSlice';

describe('constructorSlice', () => {
  const mockIngredient = {
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
  };

  const mockIngredient2 = {
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
  };

  const mockConstructorIngredient = {
    id: 'test-id-1',
    ingredientId: mockIngredient2._id,
    name: mockIngredient2.name,
    price: mockIngredient2.price,
    image: mockIngredient2.image
  };

  const mockConstructorIngredient2 = {
    id: 'test-id-2',
    ingredientId: '643d69a5c3f7b9001cfa093d',
    name: 'Соус Spicy-X',
    price: 90,
    image: 'sauce-image-url'
  };

  describe('initial state', () => {
    it('should have correct initial state from imported constant', () => {
      expect(initialState).toEqual({
        bun: null,
        ingredients: []
      });
    });

    it('should have correct initial state from getInitialState method', () => {
      expect(constructorSlice.getInitialState()).toEqual({
        bun: null,
        ingredients: []
      });
    });

    it('should have bun as null in initial state', () => {
      expect(initialState.bun).toBeNull();
    });

    it('should have empty ingredients array in initial state', () => {
      expect(initialState.ingredients).toEqual([]);
      expect(initialState.ingredients).toHaveLength(0);
    });

    it('should have consistent initial state between constant and method', () => {

      expect(initialState).toEqual(constructorSlice.getInitialState());
    });
  });

  describe('reducers', () => {
    it('should handle addBun', () => {
      const action = { type: 'burgerConstructor/addBun', payload: mockIngredient };
      const state = constructorSlice.reducer(initialState, action);
      
      expect(state.bun).toEqual(mockIngredient);
      expect(state.ingredients).toHaveLength(0);
    });

    it('should handle addIngredient', () => {
      const action = { 
        type: 'burgerConstructor/addIngredient', 
        payload: mockConstructorIngredient 
      };
      
      const state = constructorSlice.reducer(initialState, action);
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockConstructorIngredient);
      expect(state.bun).toBeNull();
    });

    it('should handle removeIngredient', () => {

      const stateWithIngredient = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient
      });

      const action = { 
        type: 'burgerConstructor/removeIngredient', 
        payload: mockConstructorIngredient.id 
      };
      const state = constructorSlice.reducer(stateWithIngredient, action);
      
      expect(state.ingredients).toHaveLength(0);
    });

    it('should handle moveIngredientUp', () => {

      let state = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient
      });

      state = constructorSlice.reducer(state, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient2
      });

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient2.id);

      const action = { 
        type: 'burgerConstructor/moveIngredientUp', 
        payload: 1 
      };
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient2.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient.id);
    });

    it('should handle moveIngredientDown', () => {

      let state = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient
      });

      state = constructorSlice.reducer(state, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient2
      });

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient2.id);

      const action = { 
        type: 'burgerConstructor/moveIngredientDown', 
        payload: 0 
      };
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient2.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient.id);
    });

    it('should handle updateIngredientsOrder', () => {
      const newOrder = [mockConstructorIngredient2, mockConstructorIngredient];
      const action = { 
        type: 'burgerConstructor/updateIngredientsOrder', 
        payload: newOrder 
      };
      
      const state = constructorSlice.reducer(initialState, action);
      
      expect(state.ingredients).toEqual(newOrder);
      expect(state.bun).toBeNull(); 
    });

    it('should handle clearConstructor', () => {

      let state = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addBun',
        payload: mockIngredient
      });

      state = constructorSlice.reducer(state, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient
      });

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(1);

      const action = { type: 'burgerConstructor/clearConstructor' };
      state = constructorSlice.reducer(state, action);
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
      expect(state).toEqual(initialState);
    });

    it('should not move ingredient up when it is already at the top', () => {

      let state = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient
      });

      const action = { 
        type: 'burgerConstructor/moveIngredientUp', 
        payload: 0 
      };
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient.id);
    });

    it('should not move ingredient down when it is already at the bottom', () => {

      let state = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient
      });

      const action = { 
        type: 'burgerConstructor/moveIngredientDown', 
        payload: 0 
      };
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient.id);
    });

    it('should not mutate initial state', () => {
      const originalState = { ...initialState };
      
      const action = { 
        type: 'burgerConstructor/addIngredient', 
        payload: mockConstructorIngredient 
      };
      const newState = constructorSlice.reducer(originalState, action);
      
      expect(newState).not.toBe(originalState);
      expect(newState.ingredients).not.toBe(originalState.ingredients);
      
      expect(originalState.ingredients).toHaveLength(0);
      expect(originalState.bun).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle adding bun when bun already exists', () => {

      let state = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addBun',
        payload: mockIngredient
      });

      expect(state.bun).toEqual(mockIngredient);

      const secondBun = { ...mockIngredient, _id: 'different-bun', name: 'Другая булка' };
      state = constructorSlice.reducer(state, {
        type: 'burgerConstructor/addBun',
        payload: secondBun
      });

      expect(state.bun).toEqual(secondBun);
      expect(state.bun).not.toEqual(mockIngredient);
    });

    it('should handle removing non-existent ingredient', () => {
      const action = { 
        type: 'burgerConstructor/removeIngredient', 
        payload: 'non-existent-id' 
      };
      
      const state = constructorSlice.reducer(initialState, action);
      
      expect(state).toEqual(initialState);
    });

    it('should handle moving with invalid indexes', () => {

      let state = constructorSlice.reducer(initialState, {
        type: 'burgerConstructor/addIngredient',
        payload: mockConstructorIngredient
      });

      const actionNegative = { 
        type: 'burgerConstructor/moveIngredientUp', 
        payload: -1 
      };
      let newState = constructorSlice.reducer(state, actionNegative);
      expect(newState).toEqual(state); 

      const actionOutOfBounds = { 
        type: 'burgerConstructor/moveIngredientDown', 
        payload: 10 
      };
      newState = constructorSlice.reducer(state, actionOutOfBounds);
      expect(newState).toEqual(state); 
    });
  });
});
