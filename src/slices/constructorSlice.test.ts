import { 
  constructorSlice, 
  initialState, 
  addBun, 
  addIngredient, 
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  updateIngredientsOrder
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const mockIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image-url',
    image_large: 'image-large-url',
    image_mobile: 'image-mobile-url'
  };

  const mockIngredient2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'image-url',
    image_large: 'image-large-url',
    image_mobile: 'image-mobile-url'
  };

  const mockConstructorIngredient: TConstructorIngredient = {
    ...mockIngredient2,
    id: 'test-id-1'
  };

  const mockConstructorIngredient2: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 90,
    price: 90,
    image: 'sauce-image-url',
    image_large: 'sauce-image-large-url',
    image_mobile: 'sauce-image-mobile-url',
    id: 'test-id-2'
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

    it('should have consistent initial state between constant and method', () => {
      expect(initialState).toEqual(constructorSlice.getInitialState());
    });
  });

  describe('reducers', () => {
    it('should handle addBun', () => {
      const action = addBun(mockIngredient);
      const state = constructorSlice.reducer(initialState, action);
      
      expect(state.bun).toEqual(mockIngredient);
      expect(state.ingredients).toHaveLength(0);
    });

    it('should handle addIngredient', () => {
      const action = addIngredient(mockConstructorIngredient);
      const state = constructorSlice.reducer(initialState, action);
      
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockConstructorIngredient);
      expect(state.bun).toBeNull();
    });

    it('should handle removeIngredient', () => {
      const stateWithIngredient = constructorSlice.reducer(
        initialState, 
        addIngredient(mockConstructorIngredient)
      );

      const action = removeIngredient(mockConstructorIngredient.id);
      const state = constructorSlice.reducer(stateWithIngredient, action);
      
      expect(state.ingredients).toHaveLength(0);
    });

    it('should handle moveIngredientUp', () => {
      let state = constructorSlice.reducer(
        initialState, 
        addIngredient(mockConstructorIngredient)
      );

      state = constructorSlice.reducer(
        state, 
        addIngredient(mockConstructorIngredient2)
      );

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient2.id);

      const action = moveIngredientUp(1);
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient2.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient.id);
    });

    it('should handle moveIngredientDown', () => {
      let state = constructorSlice.reducer(
        initialState, 
        addIngredient(mockConstructorIngredient)
      );

      state = constructorSlice.reducer(
        state, 
        addIngredient(mockConstructorIngredient2)
      );

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient2.id);

      const action = moveIngredientDown(0);
      state = constructorSlice.reducer(state, action);

      expect(state.ingredients[0].id).toBe(mockConstructorIngredient2.id);
      expect(state.ingredients[1].id).toBe(mockConstructorIngredient.id);
    });

    it('should handle updateIngredientsOrder', () => {
      const newOrder = [mockConstructorIngredient2, mockConstructorIngredient];
      const action = updateIngredientsOrder(newOrder);
      
      const state = constructorSlice.reducer(initialState, action);
      
      expect(state.ingredients).toEqual(newOrder);
      expect(state.bun).toBeNull();
    });

    it('should handle clearConstructor', () => {
      let state = constructorSlice.reducer(
        initialState, 
        addBun(mockIngredient)
      );

      state = constructorSlice.reducer(
        state, 
        addIngredient(mockConstructorIngredient)
      );

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(1);

      const action = clearConstructor();
      state = constructorSlice.reducer(state, action);
      
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
      expect(state).toEqual(initialState);
    });
  });
});
