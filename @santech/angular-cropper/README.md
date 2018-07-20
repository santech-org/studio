@santech/angular-cropper
[![Dependency Status](https://david-dm.org/santech-org/studio/peer-status.svg?path=%40santech%2Fangular-cropper)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-cropper&type=peer)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fangular-cropper)](https://david-dm.org/santech-org/studio?path=%40santech%2Fangular-cropper&type=dev)
========

@santech/angular-cropper is a npm module that exports cropper components for santech assets.

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
npm publish dist.tgz
```

## Require package in your project

```
npm i @santech/angular-cropper -S
```

Import module

```javascript
import { SantechCropperModule } from '@santech/angular-cropper';

@NgModule({
  imports: [
    SantechCropperModule.forRoot(),
  ],
})
export class AppModule { }
```
