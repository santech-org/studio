import { TWebSocketSbscrbCb } from '@santech/websocket';
import * as StompJs from '@stomp/stompjs';

export type ackType = 'client' | 'client-individual';

export interface IWsFrame extends StompJs.Message {
  headers: {
    action: string;
  };
}

export interface IWebSocketSubscription {
  cb: TWebSocketSbscrbCb;
  ackHeaders?: StompJs.StompHeaders;
}

export interface ITopicSubscription extends IWebSocketSubscription {
  path: string;
}

export interface ISubscribedTopic extends ITopicSubscription {
  unsubscribe: () => void;
}
