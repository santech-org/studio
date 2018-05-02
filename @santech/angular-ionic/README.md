# @santech/angular-ionic

@santech/angular-ionic is a npm module that exports common ionic directives of the santech assets

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
npm i @santech/angular-ionic -S
```

Import module

```typescript
import { SantechIonicModule } from '@santech/angular-ionic';

@NgModule({
  imports: [
    SantechIonicModule,
  ],
})
export class AppModule { }
```
