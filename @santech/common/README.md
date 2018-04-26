@santech/common
[![Dependency Status](https://david-dm.org/santech-org/studio/status.svg?path=%40santech%2Fcommon)](https://david-dm.org/santech-org/studio?path=%40santech%2Fcommon)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fcommon)](https://david-dm.org/santech-org/studio?path=%40santech%2Fcommon&type=dev)
========

@santech/common is a npm module that exports common models of the santech studio

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
npm i @santech/common -S
```

Import module

```javascript
import { Authenticator } from '@santech/common';
// or
var Authenticator = require('@santech/common').Authenticator;
// or
var Authenticator = Santech.Common.Authenticator;
```

## Examples

Angular 1

```html
<script type="text/javascript" src="./node_modules/@santech/core/dist/umd/index.js"></script>
<script type="text/javascript" src="./node_modules/@santech/common/dist/umd/index.js"></script>
```

```javascript
class MyCtrl {
  constructor(auth) {
    this._auth = auth;

    auth.waitForLogin
      .then((err) => {
        if (err) {
          // error during session recovery
        }

        if (auth.isLogged()) {
          // already logged in
        }
        // not logged in
      });
  }

  login() {
    this._auth.authenticate('login', 'password')
      .then(() => {
        // logged in
      })
      .catch(() => {
        // error
      });
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
  .controller('MyCtrl', ['santech-authenticator', MyCtrl])
  .run(['santech-http', '$rootScope', function (http, $rootScope) {
    http.addResponseInterceptor(() => {
      $rootScope.$applyAsync();
    })
  }]);
```

Angular 2

```typescript
import { Component, InjectionToken, Optional } from '@angular/core';
import { Authenticator, IAuthenticatorEndPoints } from '@santech/common';
import { Http, Jwt, TokenStorage } from '@santech/core';

export const AUTHENTICATOR_END_POINTS = new InjectionToken<IAuthenticatorEndPoints>('authenticatorEndPoints');

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
      useFactory: () => new TokenStorage(localStorage),
    },
    {
      provide: Authenticator,
      useClass: Authenticator,
      deps: [Http, TokenStorage, Jwt, AUTHENTICATOR_END_POINTS],
    },
    {
      provide: AUTHENTICATOR_END_POINTS,
      useValue: {
        authenticateEndPoint: 'your/endpoint/to/gateway/authenticate';
        endPoint: 'your/endpoint/to/gateway';
        renewEndPoint: 'your/endpoint/to/gateway/renew';
      },
    },
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _auth: Authenticator;

  constructor(auth: Authenticator) {
    this._auth = auth;

    auth.waitForLogin
      .then((err) => {
        if (err) {
          // error during session recovery
        }

        if (auth.isLogged()) {
          // already logged in
        }
        // not logged in
      });
  }

  public login() {
    this._auth.authenticate('login', 'password')
      .then(() => {
        // logged in
      })
      .catch(() => {
        // error
      });
  }
}
```
