import { inject, TestBed } from '@angular/core/testing';
import { CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { PLATFORM_GLOBAL_CONTEXT, SantechPlatformModule } from '@santech/angular-platform';
import { WebSocketClient } from '@santech/websocket';
import '@stomp/stompjs';
import sockjs = require('sockjs-client');
import { SantechWebSocketModule, SOCKJS_CLIENT, STOMPJS, stompjsFactory } from './';

const endPoint = 'http://host:port';
const wsEndPoint = 'ws://host:port';

describe('SantechWebsocketModule', () => {
  describe('When imported in another module', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot({
          endPointsProvider: {
            provide: CONFIG_END_POINTS,
            useValue: { endPoint, wsEndPoint },
          },
        }),
        SantechWebSocketModule.forRoot({
          sockjsProvider: {
            provide: SOCKJS_CLIENT,
            useValue: sockjs,
          },
          stompjsProvider: {
            deps: [PLATFORM_GLOBAL_CONTEXT],
            provide: STOMPJS,
            useFactory: stompjsFactory,
          },
        }),
      ],
    }));

    it('Should provide santech websocket client', inject([WebSocketClient], (client: WebSocketClient) => {
      expect(client instanceof WebSocketClient).toBeTruthy();
    }));
  });

  describe('When badly configured', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot({
          endPointsProvider: {
            provide: CONFIG_END_POINTS,
            useValue: { endPoint, wsEndPoint },
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
    }));

    it('Should throw about missing configuration', () => {
      expect(() => TestBed.get(WebSocketClient))
        .toThrow('SantechWebSocketModule must be configured for websockets ! See forRoot module method');
    });
  });

  describe('When imported in a child module', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechWebSocketModule.forChild(),
      ],
    }));

    it('Should not inject providers', () => {
      expect(() => TestBed.get(WebSocketClient)).toThrow();
    });
  });
});
