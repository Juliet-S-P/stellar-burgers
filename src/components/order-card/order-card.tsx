import { FC, memo, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { getAllIngredients } from '../../slices/ingredientsSlice';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients: TIngredient[] = useSelector(getAllIngredients);

  if (!order) return null;

  const orderInfo = useMemo(() => {
    if (!order || !ingredients?.length) return null;

    const ingredientsInfo = (order.ingredients || []).reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find(
          (ing: TIngredient) => ing._id === item
        );
        if (ingredient) {
          return [...acc, ingredient];
        }
        return acc;
      },
      [] as TIngredient[]
    );

    const total = ingredientsInfo.reduce(
      (acc: number, item: TIngredient) => acc + item.price,
      0
    );
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;
    const date = new Date(order.createdAt || Date.now());

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
