import { Authenticator } from '@santech/common';
import * as StompJs from '@stomp/stompjs';
import * as SockJs from 'sockjs-client';

const webSocketReg = /^ws(s?):\/\//;

export interface IStompHeartbeatConfiguration {
  outgoing: number;
  incoming?: number;
}

export interface IStompConfiguration {
  connectionString: string;
  heartbeats?: IStompHeartbeatConfiguration;
  reconnectDelay?: number;
  debug?: boolean;
}

export type TWebSocketSbscrbCb = (msg: string, frame?: StompJs.Message, ack?: () => void, nack?: () => void) => void;

export interface IWebSocketUnsubscriber {
  unsubscribe: void;
}

export interface IWebSocketSubscriber {
  subscribe(cb: TWebSocketSbscrbCb, ackHeaders?: StompJs.StompHeaders): IWebSocketUnsubscriber;
}

export interface IWebSocketClient {
  readonly waitForConnection: Promise<StompJs.Frame | void>;
  connect(): Promise<StompJs.Frame | void>;
  disconnect(): Promise<void>;
  setTopic(topic: string): IWebSocketSubscriber;
}

export class WebSocketClient implements IWebSocketClient {
  private _auth: Authenticator;
  private _client: StompJs.Client | undefined;
  private _config: IStompConfiguration;
  private _stomp: typeof StompJs;
  private _sockJs: typeof SockJs;
  private _connectionPromise: Promise<StompJs.Frame | void> | undefined;

  constructor(auth: Authenticator, stomp: typeof StompJs, sockJs: typeof SockJs, config: IStompConfiguration) {
    this._auth = auth;
    this._stomp = stomp;
    this._sockJs = sockJs;
    this._config = config;
  }

  get waitForConnection() {
    return this._connectionPromise || (this._connectionPromise = this.connect());
  }

  public connect() {
    let client: StompJs.Client;
    const config = this._config;
    const connection = config.connectionString;
    const reconnectDelay = config.reconnectDelay || 5000;
    const heartbeats = config.heartbeats || {};

    this._client = client = (webSocketReg.test(connection))
      ? this._stomp.client(connection)
      // TODO better typing
      : this._stomp.over(new this._sockJs(connection) as any as WebSocket);

    client.heartbeat = {
      incoming: 0,
      outgoing: 20000,
      ...heartbeats,
    };

    client.reconnect_delay = reconnectDelay;

    if (!config.debug) {
      client.debug = null as any;
    }

    return new Promise<StompJs.Frame | void>((res) => {
      return client.connect({ Authorization: this._auth.getAuthorizationHeader() } as any, res);
    });
  }

  public disconnect(): Promise<void> {
    const client = this._client;

    if (!client) {
      return Promise.reject(new Error(`WebSocketClient(disconnect): not connected`));
    }

    return new Promise((res) => client.disconnect(() => {
      delete this._connectionPromise;
      res();
    }));
  }

  public setTopic(topic: string) {
    const client = this._client;
    if (!client) {
      throw new Error(`WebSocketClient(setTopic): not connected`);
    }

    return {
      subscribe: (
        cb: (message: string, frame?: StompJs.Message, ack?: () => void, nack?: () => void) => void,
        ackHeaders?: StompJs.StompHeaders) => {
        const subscription = client.subscribe(topic, (frame: StompJs.Message) => {
          return ackHeaders
            ? cb(frame.body, frame, frame.ack.bind(frame), frame.nack.bind(frame))
            : cb(frame.body, frame);
        }, ackHeaders);
        return {
          unsubscribe: subscription.unsubscribe.bind(subscription),
        };
      },
    };
  }
}

export interface IWebSocketClientFactory {
  create(
    auth: Authenticator,
    stomp: typeof StompJs,
    sockJs: typeof SockJs,
    config: IStompConfiguration): WebSocketClient;
}

export const webSocketClientFactory: IWebSocketClientFactory = {
  create: (auth: Authenticator, stomp: typeof StompJs, sockJs: typeof SockJs, config: IStompConfiguration) => {
    return new WebSocketClient(auth, stomp, sockJs, config);
  },
};
