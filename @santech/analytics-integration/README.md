# @santech/analytics-integration

@santech/analytics-integration is a npm module that exports analytics integration of the santech studio

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
npm i @santech/analytics-integration -S
```

Import module

```javascript
import { SantechIntegration } from '@santech/analytics-integration';
// or
var SantechIntegration = require('@santech/analytics-integration').SantechIntegration;
// or
var SantechIntegration = Santech.AnalyticsIntegration.SantechIntegration;
```

## Examples

Angular 1

```html
<script type="text/javascript" src="./node_modules/@santech/core/dist/umd/index.js"></script>
<script type="text/javascript" src="./node_modules/@santech/analytics-core/dist/umd/index.js"></script>
<script type="text/javascript" src="./node_modules/@santech/analytics-integration/dist/umd/index.js"></script>
```

```javascript
class MyCtrl {
  constructor() {
    Santech.AnalyticsCore.analytics.page();
  }
}

angular.module('santech', [])
  .constant('santech-endpoints', {
    publicEndPoint: 'your/backend/public-endpoint/api/version',
  })
  .service('santech-http', Santech.Core.Http)
  .service('santech-integration', ['santech-http','santech-endpoints', Santech.AnalyticsIntegration.SantechIntegration])
  .run(['santech-http', '$rootScope', function (http, $rootScope) {
    http.addResponseInterceptor(() => {
      $rootScope.$applyAsync();
    })
  }])
  .run(['santech-integration', function (santechIntegration) {
    analytics.add(santechIntegration);
    analytics.init();
  }]);
```

Angular 2

```typescript
import { InjectionToken, NgModule } from '@angular/core';
import { analytics } from '@santech/analytics-core';
import { SantechIntegration } from '@santech/analytics-integration';
import { CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Http } from '@santech/core';

const ANALYTICS_OPTIONS = new InjectionToken<any>('analyticsOptions');

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
  providers: [
    {
      provide: SantechIntegration,
      useClass: SantechIntegration,
      deps: [Http, END_POINTS, ANALYTICS_OPTIONS],
    },
    {
      provide: ANALYTICS_OPTIONS,
      useValue: null,
    },
  ],
})
export class AppModule {
  constructor(integration: SantechIntegration) {
    analytics.add(integration);
    analytics.init();
  }
}
```
