import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  getOrderByNumber,
  getSelectedOrder,
  getOrderLoading
} from '../../slices/feedSlice';
import { getAllIngredients } from '../../slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(getSelectedOrder);
  const ingredients: TIngredient[] = useSelector(getAllIngredients);
  const loading = useSelector(getOrderLoading);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
