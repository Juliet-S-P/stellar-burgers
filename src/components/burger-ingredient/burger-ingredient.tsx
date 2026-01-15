import { FC, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addBun, addIngredient } from '../../slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleIngredientClick = () => {
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
