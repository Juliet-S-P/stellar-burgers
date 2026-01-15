import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrders,
  getSortedProfileOrders,
  getProfileWsConnected,
  getProfileWsError
} from '../../slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const orders = useSelector(getSortedProfileOrders);
  const wsConnected = useSelector(getProfileWsConnected);
  const wsError = useSelector(getProfileWsError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!wsConnected) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch, wsConnected]);

  return <ProfileOrdersUI orders={orders} />;
};
