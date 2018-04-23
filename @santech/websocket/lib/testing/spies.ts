import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';
// tslint:disable-next-line:no-implicit-dependencies
import { WebSocketClient } from '@santech/websocket';

export interface ISpyWebSocketUnsubscriber {
  unsubscribe: jasmine.Spy & jest.Mock<any>;
}

export interface ISpyWebSocketSubscriber {
  subscribe: jasmine.Spy & jest.Mock<any>;
}

export const websocketClientMethods = Object
  .getOwnPropertyNames(WebSocketClient.prototype).filter(filterPrivate);

let spyWebSocketUnsubscriber: SantechSpyObject<ISpyWebSocketUnsubscriber>;
let spyWebSocketSubscriber: SantechSpyObject<ISpyWebSocketSubscriber>;
let spyWebSocketClient: SantechSpyObject<WebSocketClient>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyWebSocketUnsubscriber = jasmine
    .createSpyObj('spyWebSocketUnsubscriber', ['unsubscribe']);

  spyWebSocketSubscriber = jasmine
    .createSpyObj('spyWebSocketSubscriber', ['subscribe']);

  spyWebSocketClient = jasmine.createSpyObj('spyWebSocketClient', websocketClientMethods);

  spyWebSocketSubscriber.subscribe.and.returnValue(spyWebSocketUnsubscriber);
  (spyWebSocketClient as any).waitForConnection = Promise.resolve() as any;
  spyWebSocketClient.setTopic.and.returnValue(spyWebSocketSubscriber);

} else if (typeof jest !== 'undefined') {
  spyWebSocketUnsubscriber = createJestSpyObj(['unsubscribe']);
  spyWebSocketSubscriber = createJestSpyObj(['subscribe']);
  spyWebSocketClient = createJestSpyObj(websocketClientMethods);

  spyWebSocketSubscriber.subscribe.mockReturnValue(spyWebSocketUnsubscriber);
  (spyWebSocketClient as any).waitForConnection = Promise.resolve() as any;
  spyWebSocketClient.setTopic.mockReturnValue(spyWebSocketSubscriber);
}

export {
  spyWebSocketUnsubscriber,
  spyWebSocketSubscriber,
  spyWebSocketClient,
};
