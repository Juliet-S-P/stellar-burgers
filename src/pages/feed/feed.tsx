import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  getSortedFeeds,
  getWsConnected,
  getWsError
} from '../../slices/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getSortedFeeds);
  const wsConnected = useSelector(getWsConnected);
  const wsError = useSelector(getWsError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!wsConnected) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, wsConnected]);

  if (!orders.length && !wsConnected) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
