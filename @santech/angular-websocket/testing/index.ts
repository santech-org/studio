import { WebSocketService } from '@santech/angular-websocket';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export const webSocketServiceMethods = Object
  .getOwnPropertyNames(WebSocketService.prototype).filter(filterPrivate);

let spyWebSocketService: SantechSpyObject<WebSocketService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyWebSocketService = jasmine.createSpyObj('spyWebSocketService', webSocketServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyWebSocketService = createJestSpyObj(webSocketServiceMethods);
}

export {
  spyWebSocketService,
};
