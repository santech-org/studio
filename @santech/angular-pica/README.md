@santech/angular-pica
[![Dependency Status](https://david-dm.org/santech-org/studio/peer-status.svg?path=%40santech%2Fangular-pica)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-pica&type=peer)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fangular-pica)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-pica&type=dev)
========

@santech/angular-pica is a npm module that exports pica module for angular

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
npm i @santech/angular-pica -S
```

Import module

```javascript
import { SantechPicaModule } from '@santech/angular-pica';
// or
var SantechPicaModule = require('@santech/angular-pica').SantechPicaModule;
// or
var SantechPicaModule = santech.AngularPica.SantechPicaModule;
```

## Examples

Angular 2

```typescript
import { Component, NgModule } from '@angular/core';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { PicaService, SantechPicaModule } from '@santech/angular-pica';

@NgModule({
  imports: [
    SantechPlatformModule.forRoot(),
    SantechCommonModule.forRoot(),
    SantechPicaModule.forRoot(),
  ],
  declarations: [AppComponent]
})
export class AppModule {}

@Component({
  selector: 'app',
  template: 'template',
})
export class AppComponent {
  constructor(private picaService: PicaService) {
    // You get pica service
  }

  public resize(input: File | string) {
    return this.picaService.resizeImage({
      data: input,
      height: 768,
      width: 1024,
    }).then((output) => {
      // output is a File if you gave a File / a string otherwise
    });
  }
}
```
