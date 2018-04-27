@santech/angular-analytics
[![Dependency Status](https://david-dm.org/santech-org/studio/peer-status.svg?path=%40santech%2Fangular-analytics)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-analytics&type=peer)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fangular-analytics)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-analytics&type=dev)
========

@santech/angular-analytics is a npm module that exports santech analytics module for angular

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
npm i @santech/angular-analytics -S
```

Import module

```javascript
import { SantechAnalyticsModule } from '@santech/angular-analytics';
// or
var SantechAnalyticsModule = require('@santech/angular-analytics').SantechAnalyticsModule;
// or
var SantechAnalyticsModule = santech.AngularAnalytics.SantechAnalyticsModule;
```

## Examples

Angular 2

```typescript
import { Component, Inject, NgModule } from '@angular/core';
import { IAnalyticsJS } from '@santech/analytics-core';
import { ANALYTICS, SantechAnalyticsModule } from '@santech/angular-analytics';
import { CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';

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
  constructor(@Inject(ANALYTICS) analytics: IAnalyticsJS) {
    analytics.page();
  }
}
```
