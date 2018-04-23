import { Provider } from '@angular/core';

export interface ISantechWebSocketModuleConfiguration {
  sockjsProvider: Provider;
  stompjsProvider: Provider;
}
