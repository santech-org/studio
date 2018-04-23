import { TWebSocketSbscrbCb } from '@santech/websocket';
import * as StompJS from '@stomp/stompjs';

export type ackType = 'client' | 'client-individual';

export interface IWsFrame extends StompJS.Message {
  headers: {
    action: string;
  };
}

export interface IWebSocketSubscription {
  cb: TWebSocketSbscrbCb;
  ackHeaders?: StompJS.StompHeaders;
}

export interface ITopicSubscription extends IWebSocketSubscription {
  path: string;
}

export interface ISubscribedTopic extends ITopicSubscription {
  unsubscribe: () => void;
}
