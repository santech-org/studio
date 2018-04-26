# @santech/angular-websocket

@santech/angular-websocket is a npm module that exports santech websocket client module for angular

## Prerequisites

You need to have globally installed:

* node 9.x.x
* npm 5.x.x
* yarn 1.x.x

## Development

Install all the dependencies

```
yarn
```

Launch tests

```
yarn test
```

Build the package

```
yarn build
```

Publish the package
```
npm publish
```

## Require package in your project

```
npm i @santech/angular-websocket -S
```

Import module

```javascript
import { SantechWebSocketModule } from '@santech/angular-websocket';
// or
var SantechWebSocketModule = require('@santech/angular-websocket').SantechWebSocketModule;
// or
var SantechWebSocketModule = santech.AngularWebsocket.SantechWebSocketModule;
```

## Examples

Angular 2

```typescript
import { Component, NgModule } from '@angular/core';
import { CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { PLATFORM_GLOBAL_CONTEXT, SantechPlatformModule } from '@santech/angular-platform';
import { SantechWebSocketModule, stompjsFactory } from '@santech/angular-websocket';
import { WebSocketClient } from '@santech/websocket';
import '@stomp/stompjs';
import sockjs = require('sockjs-client');

@NgModule({
  imports: [
    SantechPlatformModule.forRoot(),
    SantechCommonModule.forRoot({
      endPointsProvider: {
        provide: CONFIG_END_POINTS,
        useValue: {
          endPoint: 'endpoint/to/gateway',
          wsEndPoint: 'ws://host:port',
        },
      },
    }),
    SantechWebSocketModule.forRoot({
      sockjsProvider: {
        provide: SOCKJS_CLIENT,
        useValue: sockjs,
      },
      stompjsProvider: {
        provide: STOMPJS,
        useFactory: stompjsFactory,
        deps: [PLATFORM_GLOBAL_CONTEXT],
      },
    }),
  ],
  declarations: [AppComponent]
})
export class AppModule {}

@Component({
  selector: 'app',
  template: 'template',
})
export class AppComponent {
  constructor(client: WebSocketClient) {
    // You get websocket client
  }
}
```
