import { Middleware, Action } from '@reduxjs/toolkit';
import { getCookie } from '../utils/cookie';
import { RootState } from '../services/store';
import { WS_FEED_CONNECT, WS_FEED_DISCONNECT } from '../slices/feedSlice';
import {
  WS_PROFILE_ORDERS_CONNECT,
  WS_PROFILE_ORDERS_DISCONNECT
} from '../slices/profileOrdersSlice';

class WebSocketService {
  constructor(
    type: 'feed' | 'profileOrders',
    url: string,
    callbacks: {
      onOpen?: () => void;
      onMessage?: (data: any) => void;
      onError?: (error: Event) => void;
      onClose?: (event: CloseEvent) => void;
    }
  ) {
    this.type = type;
    this.url = url;
    this.onOpenCallback = callbacks.onOpen;
    this.onMessageCallback = callbacks.onMessage;
    this.onErrorCallback = callbacks.onError;
    this.onCloseCallback = callbacks.onClose;
  }

  private ws: WebSocket | null = null;
  private url: string;
  private type: 'feed' | 'profileOrders';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isManualClose = false;
  private onOpenCallback?: () => void;
  private onMessageCallback?: (data: any) => void;
  private onErrorCallback?: (error: Event) => void;
  private onCloseCallback?: (event: CloseEvent) => void;

  private getWebSocketUrl(): string {
    let url = this.url;

    if (this.type === 'profileOrders') {
      const token = getCookie('accessToken');

      if (token) {
        const cleanToken = token.replace('Bearer ', '');
        if (
          cleanToken &&
          cleanToken !== 'undefined' &&
          cleanToken.length > 10
        ) {
          const encodedToken = encodeURIComponent(cleanToken);
          url = `${url}?token=${encodedToken}`;
        }
      }
    }

    return url;
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onOpenCallback?.();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessageCallback?.(data);
      } catch (error) {}
    };

    this.ws.onerror = (error) => {
      this.onErrorCallback?.(error);
    };

    this.ws.onclose = (event) => {
      if (!this.isManualClose && event.code !== 1000 && event.code !== 1001) {
        this.scheduleReconnect();
      }
      this.onCloseCallback?.(event);
    };
  }

  private scheduleReconnect() {
    if (this.isManualClose) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    if (this.type === 'profileOrders') {
      const token = getCookie('accessToken');
      if (!token) {
        return;
      }
    }

    this.reconnectAttempts++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  connect() {
    if (
      this.ws?.readyState === WebSocket.OPEN ||
      this.ws?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    this.isManualClose = false;

    const url = this.getWebSocketUrl();

    try {
      this.ws = new WebSocket(url);
      this.setupEventListeners();
    } catch (error) {
      this.scheduleReconnect();
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        this.ws.send(message);
      } catch (error) {}
    }
  }

  close() {
    this.isManualClose = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.close(1000, 'Manual close');
        } catch (error) {}
      }
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

const WS_BASE_URL = 'wss://norma.education-services.ru';
export const WS_SEND = 'WS_SEND';

export interface WSFeedConnectAction extends Action<string> {
  type: typeof WS_FEED_CONNECT;
  [key: string]: any;
}

export interface WSFeedDisconnectAction extends Action<string> {
  type: typeof WS_FEED_DISCONNECT;
  [key: string]: any;
}

export interface WSProfileOrdersConnectAction extends Action<string> {
  type: typeof WS_PROFILE_ORDERS_CONNECT;
  [key: string]: any;
}

export interface WSProfileOrdersDisconnectAction extends Action<string> {
  type: typeof WS_PROFILE_ORDERS_DISCONNECT;
  [key: string]: any;
}

export interface WSSendAction extends Action<string> {
  type: typeof WS_SEND;
  payload: any;
  [key: string]: any;
}

export type WSAction =
  | WSFeedConnectAction
  | WSFeedDisconnectAction
  | WSProfileOrdersConnectAction
  | WSProfileOrdersDisconnectAction
  | WSSendAction;

export const sendWebSocketMessage = (message: any): WSSendAction => ({
  type: WS_SEND,
  payload: message
});

const isWSAction = (action: Action<string>): action is WSAction =>
  [
    WS_FEED_CONNECT,
    WS_FEED_DISCONNECT,
    WS_PROFILE_ORDERS_CONNECT,
    WS_PROFILE_ORDERS_DISCONNECT,
    WS_SEND
  ].includes(action.type);

export const createWebSocketMiddleware = (): Middleware<{}, RootState> => {
  let feedSocket: WebSocketService | null = null;
  let profileOrdersSocket: WebSocketService | null = null;

  return (store) => (next) => (action: unknown) => {
    const typedAction = action as Action<string>;

    if (!isWSAction(typedAction)) {
      return next(action);
    }

    switch (typedAction.type) {
      case WS_FEED_CONNECT: {
        if (feedSocket?.isConnected()) {
          return next(action);
        }

        if (!feedSocket) {
          feedSocket = new WebSocketService(
            'feed',
            `${WS_BASE_URL}/orders/all`,
            {
              onOpen: () => {
                store.dispatch({
                  type: 'feed/wsConnectionChange',
                  payload: true
                });
              },
              onMessage: (data) => {
                if (data.success) {
                  store.dispatch({
                    type: 'feed/wsMessage',
                    payload: {
                      orders: data.orders,
                      total: data.total,
                      totalToday: data.totalToday
                    }
                  });
                }
              },
              onError: () => {
                store.dispatch({
                  type: 'feed/wsError',
                  payload: 'Ошибка подключения к ленте заказов'
                });
              },
              onClose: () => {
                store.dispatch({
                  type: 'feed/wsConnectionChange',
                  payload: false
                });
              }
            }
          );

          feedSocket.connect();
        }
        break;
      }

      case WS_FEED_DISCONNECT: {
        if (feedSocket) {
          feedSocket.close();
          feedSocket = null;
        }
        break;
      }

      case WS_PROFILE_ORDERS_CONNECT: {
        if (profileOrdersSocket?.isConnected()) {
          return next(action);
        }

        if (!profileOrdersSocket) {
          profileOrdersSocket = new WebSocketService(
            'profileOrders',
            `${WS_BASE_URL}/orders`,
            {
              onOpen: () => {
                store.dispatch({
                  type: 'profileOrders/wsConnectionChange',
                  payload: true
                });
              },
              onMessage: (data) => {
                if (data.success) {
                  store.dispatch({
                    type: 'profileOrders/wsMessage',
                    payload: { orders: data.orders }
                  });
                } else {
                  store.dispatch({
                    type: 'profileOrders/wsError',
                    payload:
                      data.message || 'Ошибка подключения к истории заказов'
                  });
                }
              },
              onError: () => {
                store.dispatch({
                  type: 'profileOrders/wsError',
                  payload: 'Ошибка подключения к истории заказов'
                });
              },
              onClose: () => {
                store.dispatch({
                  type: 'profileOrders/wsConnectionChange',
                  payload: false
                });
              }
            }
          );

          profileOrdersSocket.connect();
        }
        break;
      }

      case WS_PROFILE_ORDERS_DISCONNECT: {
        if (profileOrdersSocket) {
          profileOrdersSocket.close();
          profileOrdersSocket = null;
        }
        break;
      }

      case WS_SEND: {
        const message = (typedAction as WSSendAction).payload;

        if (feedSocket?.isConnected()) {
          feedSocket.send(message);
        } else if (profileOrdersSocket?.isConnected()) {
          profileOrdersSocket.send(message);
        }
        break;
      }

      default: {
        const _exhaustiveCheck: never = typedAction;
        return _exhaustiveCheck;
      }
    }

    return next(action);
  };
};
