import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  connectProfileOrdersSocket,
  disconnectProfileOrdersSocket,
  getSortedProfileOrders,
  getProfileWsConnected,
  getProfileWsError,
  getProfileOrdersLoading
} from '../../slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const orders = useSelector(getSortedProfileOrders);
  const wsConnected = useSelector(getProfileWsConnected);
  const wsError = useSelector(getProfileWsError);
  const loading = useSelector(getProfileOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(connectProfileOrdersSocket());

    return () => {
      dispatch(disconnectProfileOrdersSocket());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!wsConnected && !loading) {
    }
  }, [dispatch, wsConnected, loading]);

  return <ProfileOrdersUI orders={orders} />;
};
