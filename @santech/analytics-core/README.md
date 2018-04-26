@santech/analytics-core
[![Dependency Status](https://david-dm.org/santech-org/studio/status.svg?path=%40santech%2Fanalytics-core)](https://david-dm.org/santech-org/studio?path=%40santech%2Fanalytics-core)
[![devDependency Status](https://david-dm.org/santech-org/studio/dev-status.svg?path=%40santech%2Fanalytics-core)](https://david-dm.org/santech-org/studio?path=%40santech%2Fanalytics-core&type=dev)
========

@santech/analytics-core is a npm module that exports segment core bundle of the santech studio

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
npm i @santech/analytics-core -S
```

Import module

```javascript
import { analytics } from '@santech/analytics-core';
// or
var analytics = require('@santech/analytics-core').analytics;
// or
var analytics = Santech.AnalyticsCore.analytics;
```

## Examples

Angular 1

```html
<script type="text/javascript" src="./node_modules/@santech/analytics-core/dist/umd/index.js"></script>
```

```javascript
Santech.AnalyticsCore.analytics.page();
```

Angular 2

```typescript
import { analytics } from '@santech/analytics-core';

analytics.page();
```