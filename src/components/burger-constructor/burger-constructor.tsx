import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getOrderModalData,
  getOrderRequest,
  createOrder,
  clearOrder
} from '../../slices/orderSlice';
import {
  clearConstructor,
  getConstructorBun,
  getConstructorIngredients
} from '../../slices/constructorSlice';
import { getUser } from '../../slices/authSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(getConstructorBun);
  const ingredients = useSelector(
    getConstructorIngredients
  ) as TConstructorIngredient[];
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const user = useSelector(getUser);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!bun || orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    const burgerData = [
      bun._id,
      ...ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      bun._id
    ];

    dispatch(createOrder(burgerData))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Ошибка создания заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
