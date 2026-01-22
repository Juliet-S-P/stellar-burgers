import {
  createSelector,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../services/store';

type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const ingredients = await getIngredientsApi();
    return ingredients;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Неизвестная ошибка при загрузке ингредиентов');
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearIngredientsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      });
  }
});

export const getAllIngredients = (state: RootState) => state.ingredients.items;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const getBuns = createSelector([getAllIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'bun')
);

export const getMains = createSelector([getAllIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'main')
);

export const getSauces = createSelector([getAllIngredients], (ingredients) =>
  ingredients.filter((item) => item.type === 'sauce')
);

export const getIngredientById = (id: string) =>
  createSelector([getAllIngredients], (ingredients) =>
    ingredients.find((item) => item._id === id)
  );

export const { clearIngredientsError } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
