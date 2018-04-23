import { ModuleWithProviders, NgModule } from '@angular/core';
import { END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { Authenticator } from '@santech/common';
import { WebSocketClient } from '@santech/websocket';
import { ISantechWebSocketModuleConfiguration } from './interfaces/configuration';
import { webSocketClientFactory } from './models/web-socket-client.factory';
import { WebSocketService } from './models/web-socket.service';
import { SOCKJS_CLIENT } from './tokens/sockjs-clients.token';
import { STOMPJS } from './tokens/stompjs.token';

export * from './interfaces/configuration';
export * from './interfaces/websocket';
export * from './models/stompjs.factory';
export * from './models/web-socket.service';
export * from './tokens/sockjs-clients.token';
export * from './tokens/stompjs.token';
export * from './tokens/ws-topics.token';

@NgModule({
  imports: [
    SantechCommonModule.forChild(),
  ],
})
export class SantechWebSocketModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechWebSocketModule,
    };
  }

  public static forRoot(config: ISantechWebSocketModuleConfiguration): ModuleWithProviders {
    return {
      ngModule: SantechWebSocketModule,
      providers: [
        WebSocketService,
        config.sockjsProvider,
        config.stompjsProvider,
        {
          deps: [Authenticator, SOCKJS_CLIENT, STOMPJS, END_POINTS],
          provide: WebSocketClient,
          useFactory: webSocketClientFactory,
        },
      ],
    };
  }
}
