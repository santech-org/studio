@santech/angular-i18n
[![Dependency Status](https://david-dm.org/santech-org/studio/peer-status.svg?path=%40santech%2Fangular-i18n)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-i18n&type=peer)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fangular-i18n)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-i18n&type=dev)
========

@santech/angular-i18n is a npm module that exports santech i18n module for angular

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
npm i @santech/angular-i18n -S
```

Import module

```javascript
import { SantechI18nModule } from '@santech/angular-i18n';
// or
var SantechI18nModule = require('@santech/angular-i18n').SantechI18nModule;
// or
var SantechI18nModule = santech.AngularI18n.SantechI18nModule;
```

## Examples

Angular 2

```typescript
import { Inject, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LOCALES, LocalesService, SantechI18nModule } from '@santech/angular-i18n';
import { SantechPlatformModule } from '@santech/angular-platform';
import * as en from './locales/en.json';
import * as fr from './locales/fr.json';
import { LABELS } from './tokens/labels';

@NgModule({
  imports: [
    SantechPlatformModule.forRoot(),
    SantechI18nModule.forRoot({
      localesProvider: {
        provide: LOCALES,
        useValue: {
          en: { ...en },
          fr: { ...fr },
        },
      },
    }),
    TranslateModule.forRoot(),
  ],
  providers: [
    {
      provide: LABELS,
      useValue: [
        'alert.lockedAccount.text',
        'alert.lockedAccount.title',
        'alert.sessionExpired.text',
        'alert.sessionExpired.title',
        'alert.tryAgain',
        'alert.wrongLogin',
      ],
    },
  ],
})
export class AppModule {
  constructor(localesService: LocalesService, @Inject(LABELS) labels: string[]) {
    localesService.init(labels);
  }
}
```
