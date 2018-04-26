@santech/angular-common
[![Dependency Status](https://david-dm.org/santech-org/studio/status.svg?path=%40santech%2Fangular-common)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-common)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fangular-common)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-common&type=dev)
========

@santech/angular-common is a npm module that exports santech common module for angular

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
npm i @santech/angular-common -S
```

Import module

```javascript
import { SantechCommonModule } from '@santech/angular-common';
// or
var SantechCommonModule = require('@santech/angular-common').SantechCommonModule;
// or
var SantechCommonModule = santech.AngularCommon.SantechCommonModule;
```

## Examples

Angular 2

```typescript
import { Component, Inject, NgModule } from '@angular/core';
import { CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Authenticator } from '@santech/common';

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
  ],
  declarations: [AppComponent]
})
export class AppModule {}

@Component({
  selector: 'app',
  template: 'template',
})
export class AppComponent {
  constructor(auth: Authenticator) {
    // You get an Authenticator
  }
}
```
