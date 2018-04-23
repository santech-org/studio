# @santech/core

@santech/core is a npm module that exports core models of the santech studio

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
npm i @santech/core -S
```

Import module

```javascript
import { Http } from '@santech/core';
// or
var Http = require('@santech/core').Http;
// or
var Http = Santech.Core.Http;
```

## Examples

Angular 1

```html
<script type="text/javascript" src="./node_modules/@santech/core/dist/umd/index.js"></script>
```

```javascript
class MyCtrl {
  constructor(http) {
    http.get('some/url')
      .then((fooBar) => {
        console.log(fooBar.foo);
      });
  }
}

angular.module('santech', [])
  .factory('santech-http', () => new Santech.Core.Http(fetch, Headers))
  .controller('MyCtrl', ['santech-http', MyCtrl])
  .run(['santech-http', '$rootScope', function (http, $rootScope) {
    http.addResponseInterceptor(() => {
      $rootScope.$applyAsync();
    })
  }]);
```

Angular 2

```typescript
import { Component, Optional } from '@angular/core';
import { Http } from '@santech/core';

interface FooBar {
  foo: string;
}

@Component({
  providers: [{
    provide: Http,
    useFactory: () => new Http(fetch, Headers),
  }],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(http: Http) {
    http.get<FooBar>('some/url')
      .then((fooBar) => {
        console.log(fooBar.foo);
      });
  }
}
```
