import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  getSortedFeeds,
  getWsConnected,
  getWsError,
  connectFeedSocket,
  disconnectFeedSocket
} from '../../slices/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getSortedFeeds);
  const wsConnected = useSelector(getWsConnected);
  const wsError = useSelector(getWsError);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(connectFeedSocket());

    return () => {
      dispatch(disconnectFeedSocket());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!wsConnected && !wsError) {
      dispatch(fetchFeeds());
    }
  }, [dispatch, wsConnected, wsError]);

  if (!orders.length && !wsConnected && !wsError) {
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
