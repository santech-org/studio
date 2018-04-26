import { Authenticator, IWsEndPoints } from '@santech/common';
import { WebSocketClient, webSocketClientFactory as factory } from '@santech/websocket';
import * as StompJs from '@stomp/stompjs';
import * as SockJs from 'sockjs-client';

export function webSocketClientFactory(
  auth: Authenticator,
  sockjs: typeof SockJs,
  stompjs: typeof StompJs,
  endpoints: IWsEndPoints): WebSocketClient {
  if (!stompjs || !sockjs) {
    throw new Error('SantechWebSocketModule must be configured for websockets ! See forRoot module method');
  }

  const connectionString = endpoints.wsEndPoint;
  if (!connectionString) {
    throw new Error('SantechCommonModule must be configured for websockets ! Provide wsEndPoint');
  }

  return factory.create(auth, stompjs, sockjs, {
    connectionString,
  });
}
