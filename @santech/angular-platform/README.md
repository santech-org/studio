@santech/angular-platform
[![Dependency Status](https://david-dm.org/santech-org/studio/peer-status.svg?path=%40santech%2Fangular-platform)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-platform&type=peer)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fangular-platform)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-platform&type=dev)
========

@santech/angular-platform is a npm module that exports platform global variables & constructors for angular

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
npm i @santech/angular-platform -S
```

Import module

```javascript
import { SantechPlatformModule } from '@santech/angular-platform';
// or
var SantechPlatformModule = require('@santech/angular-platform').SantechPlatformModule;
// or
var SantechPlatformModule = santech.AngularPlatform.SantechPlatformModule;
```

## Examples

Angular 2

```typescript
import { Component, Inject, NgModule } from '@angular/core';
import { PLATFORM_LOCATION, SantechPlatformModule } from '@santech/angular-platform';

@NgModule({
  imports: [
    SantechPlatformModule.forRoot(),
  ],
  declarations: [AppComponent]
})
export class AppModule {}

@Component({
  selector: 'app',
  template: 'template',
})
export class AppComponent {
  constructor(@Inject(PLATFORM_LOCATION) location: Location) {
    // You get window.location in browser
  }
}
```
