# @santech/websocket

@santech/websocket is a npm module that exports connector for the websocket studio

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
npm test
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
npm i @santech/websocket -S
```

Import module

```javascript
// need to import Stomp & SockJs globally
import '@stomp/stompjs';
import 'sockjs-client';

import { webSocketClientFactory } from '@santech/websocket';
// or
var webSocketClientFactory = require('@santech/websocket').webSocketClientFactory;
// or
var webSocketClientFactory = Santech.Websocket.webSocketClientFactory;
```

## Examples

Angular 1

```html
<script type="text/javascript" src="./node_modules/sockjs-client/dist/sockjs.min.js"></script>
<script type="text/javascript" src="./node_modules/stompjs/lib/stomp.min.js"></script>
<script type="text/javascript" src="./node_modules/@santech/core/dist/umd/index.js"></script>
<script type="text/javascript" src="./node_modules/@santech/common/dist/umd/index.js"></script>
<script type="text/javascript" src="./node_modules/@santech/websocket/dist/umd/index.js"></script>
```

```javascript
class MyCtrl {
  constructor(wsClient) {
    wsClient.waitForConnection
      .then(() => wsClient.setTopic('/topic/messages')
        .subscribe((message) => {
          // Do something with message
        }));
  }
}

angular.module('santech', [])
  .constant('santech-authenticator-endpoints', {
    authenticateEndPoint: 'your/endpoint/to/gateway/authenticate';
    endPoint: 'your/endpoint/to/gateway';
    renewEndPoint: 'your/endpoint/to/gateway/renew';
  })
  .factory('santech-http', () => new Santech.Core.Http(fetch, Headers))
  .factory('santech-storage', () => new Santech.Core.TokenStorage(localStorage))
  .factory('santech-jwt', () => new Santech.Core.Jwt(atob))
  .service('santech-authenticator', ['santech-http', 'santech-storage', 'santech-jwt', 'santech-authenticator-endpoints', Santech.Common.Authenticator])
  .factory('santech-websocket-client', ['santech-authenticator', function(authenticator) {
    return webSocketClientFactory(authenticator, window.Stomp, window.SockJs, {
      connectionString: 'ws://host:port',
      debug: true,
    });
  })
  .controller('MyCtrl',['santech-websocket-client', MyCtrl])
  .run(['santech-http', '$rootScope', (http, $rootScope) => {
    http.addResponseInterceptor(() => {
      $rootScope.$applyAsync();
    })
  }]);
```

Angular 2

```typescript
import { Component, Optional } from '@angular/core';
import { Authenticator } from '@santech/common';
import { Http, Jwt, TokenStorage } from '@santech/core';
import { WebSocketClient, webSocketClientFactory } from '@santech/websocket';
import StompJs = require('@stomp/stompjs');
import SockJs = require('sockjs-client');

export const AUTHENTICATOR_END_POINTS = new InjectionToken<IAuthenticatorEndPoints>('authenticatorEndPoints');

interface ISockWindow extends Window {
  Stomp: typeof StompJs;
  SockJs: typeof SockJs;
}

@Component({
  providers: [
    {
      provide: Http,
      useFactory: () => new Http(fetch, Headers),
    },
    {
      provide: Jwt,
      useFactory: () => new Jwt(atob),
    },
    {
      provide: TokenStorage,
      useFactory: () => new TokenStorage(localStorage, AUTHENTICATOR_END_POINTS),
    },
    {
      provide: Authenticator,
      useClass: Authenticator,
      deps: [Http, TokenStorage, Jwt],
    },
    {
      provide: AUTHENTICATOR_END_POINTS,
      useValue: {
        authenticateEndPoint: 'your/endpoint/to/gateway/authenticate';
        endPoint: 'your/endpoint/to/gateway';
        renewEndPoint: 'your/endpoint/to/gateway/renew';
      },
    },
    {
      provide: WebSocketClient,
      useFactory: (auth: Authenticator) => {
        return webSocketClientFactory.create(auth, (window as ISockWindow).Stomp, (window as ISockWindow).SockJs, {
          connectionString: 'ws://host:port',
          debug: true,
        });
      },
      deps: [Authenticator],
    },
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(wsClient: WebSocketClient) {
    wsClient.waitForConnection
      .then(() => wsClient.setTopic('/topic/messages')
        .subscribe((message) => {
          // Do something with message
        }));
  }
}
```
