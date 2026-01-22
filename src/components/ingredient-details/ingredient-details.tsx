import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../../components/ui';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  getIngredientById,
  getIngredientsLoading
} from '../../slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredientData = useSelector(getIngredientById(id || ''));
  const ingredientsLoading = useSelector(getIngredientsLoading);

  if (ingredientsLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <div>Ингредиент не найден</div>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
