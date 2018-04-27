import { async, TestBed } from '@angular/core/testing';
import { CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { PLATFORM_SET_TIMEOUT, SantechPlatformModule } from '@santech/angular-platform';
import { WebSocketClient } from '@santech/websocket';
import { spyWebSocketClient, spyWebSocketUnsubscriber } from '@santech/websocket/testing';
import '@stomp/stompjs';
import { SantechWebSocketModule } from '..';
import { ISubscribedTopic } from '../interfaces/websocket';
import { SOCKJS_CLIENT } from '../tokens/sockjs-clients.token';
import { STOMPJS } from '../tokens/stompjs.token';
import { WS_TOPICS } from '../tokens/ws-topics.token';
import { WebSocketService } from './web-socket.service';

const firstTopicSpy = jest.fn();
const secondTopicSpy = jest.fn();

const firstTopicFactory = (timeout: typeof setTimeout) => {
  return () => new Promise((res) => timeout(() => res({
    cb: firstTopicSpy,
    path: 'first/topic/path',
  })));
};

const secondTopicFactory = () => () => ({
  cb: secondTopicSpy,
  path: 'second/topic/path',
});

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot({
          endPointsProvider: {
            provide: CONFIG_END_POINTS,
            useValue: {
              endPoint: '',
              wsEndPoint: '',
            },
          },
        }),
        SantechWebSocketModule.forRoot({
          sockjsProvider: {
            provide: SOCKJS_CLIENT,
            useValue: null,
          },
          stompjsProvider: {
            provide: STOMPJS,
            useValue: null,
          },
        }),
      ],
      providers: [
        { provide: WebSocketClient, useValue: spyWebSocketClient },
        { provide: WS_TOPICS, useFactory: firstTopicFactory, multi: true, deps: [PLATFORM_SET_TIMEOUT] },
        { provide: WS_TOPICS, useFactory: secondTopicFactory, multi: true },
      ],
    }).get(WebSocketService);
  });

  describe('When I subscribe to topics', () => {
    it('Should resolve provided topics and open ws subscriptions', async(() => {
      service.subscribeToTopics()
        .then((unsubscribers) => expect(unsubscribers).toEqual([
          {
            cb: firstTopicSpy,
            path: 'first/topic/path',
            unsubscribe: spyWebSocketUnsubscriber.unsubscribe,
          },
          {
            cb: secondTopicSpy,
            path: 'second/topic/path',
            unsubscribe: spyWebSocketUnsubscriber.unsubscribe,
          },
        ] as ISubscribedTopic[]));
    }));
  });

  describe('When I unsubscribe to topics', () => {
    it('Should disconnect webscoket client', async(() => {
      expect(spyWebSocketClient.disconnect).not.toHaveBeenCalled();
      service.unsubscribeTopics();
      expect(spyWebSocketClient.disconnect).toHaveBeenCalled();
    }));
  });
});
