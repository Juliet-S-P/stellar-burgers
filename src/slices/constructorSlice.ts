import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { RootState } from '../services/store';

export type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    },
    updateIngredientsOrder: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredients = action.payload;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  updateIngredientsOrder,
  clearConstructor
} = constructorSlice.actions;

export const getConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const getConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const getConstructorTotal = (state: RootState) => {
  const { bun, ingredients } = state.burgerConstructor;
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );
  return bunPrice + ingredientsPrice;
};

export const canCreateOrder = (state: RootState) => {
  const { bun, ingredients } = state.burgerConstructor;
  return bun !== null && ingredients.length > 0;
};

export default constructorSlice.reducer;
