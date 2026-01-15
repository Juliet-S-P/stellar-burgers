import { FC, memo, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { OrdersListUI } from '@ui';
import { OrdersListProps } from './type';
import {
  fetchProfileOrders,
  getProfileOrders,
  getProfileOrdersLoading,
  getProfileWsConnected,
  getProfileWsError
} from '../../slices/profileOrdersSlice';
import {
  fetchFeeds,
  getSortedFeeds,
  getFeedsLoading,
  getWsConnected,
  getWsError
} from '../../slices/feedSlice';
import { Preloader } from '../ui/preloader';

interface UniversalOrdersListProps extends OrdersListProps {
  mode?: 'feed' | 'profile';
}

export const OrdersList: FC<UniversalOrdersListProps> = memo(
  ({ orders: propOrders, mode = 'profile' }) => {
    const dispatch = useDispatch();

    const storeOrders = useSelector(
      mode === 'feed' ? getSortedFeeds : getProfileOrders
    );

    const loading = useSelector(
      mode === 'feed' ? getFeedsLoading : getProfileOrdersLoading
    );

    const wsConnected = useSelector(
      mode === 'feed' ? getWsConnected : getProfileWsConnected
    );

    const wsError = useSelector(
      mode === 'feed' ? getWsError : getProfileWsError
    );

    const orders = propOrders || storeOrders;

    useEffect(() => {
      if (!propOrders && !wsConnected) {
        if (mode === 'feed') {
          dispatch(fetchFeeds());
        } else {
          dispatch(fetchProfileOrders());
        }
      }
    }, [dispatch, propOrders, mode, wsConnected]);

    if (loading && !propOrders && !wsConnected) {
      return <Preloader />;
    }

    const orderByDate =
      mode === 'feed' && !propOrders
        ? orders
        : [...orders].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

    return <OrdersListUI orderByDate={orderByDate} />;
  }
);
