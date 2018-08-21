/// <reference types="node" />
// tslint:disable-next-line:no-implicit-dependencies
import * as ngPackage from 'ng-packagr';

ngPackage
  .ngPackagr()
  .forProject('ng-package.json')
  .withTsConfig('tsconfig.lib.json')
  .build()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
