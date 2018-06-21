import { CacheService, CameraService, OneSignalService } from '@santech/angular-ionic';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export * from './ionic';

export const cacheServiceMethods = Object
  .getOwnPropertyNames(CacheService.prototype).filter(filterPrivate);

export const cameraServiceMethods = Object
  .getOwnPropertyNames(CameraService.prototype).filter(filterPrivate);

export const oneSignalServiceMethods = Object
  .getOwnPropertyNames(OneSignalService.prototype).filter(filterPrivate);

let spyCacheService: SantechSpyObject<CacheService>;
let spyCameraService: SantechSpyObject<CameraService>;
let spyOneSignalService: SantechSpyObject<OneSignalService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyCacheService = jasmine.createSpyObj('spyCacheService', cacheServiceMethods);
  spyCameraService = jasmine.createSpyObj('spyCameraService', cameraServiceMethods);
  spyOneSignalService = jasmine.createSpyObj('spyOneSignalService', oneSignalServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyCacheService = createJestSpyObj(cacheServiceMethods);
  spyCameraService = createJestSpyObj(cameraServiceMethods);
  spyOneSignalService = createJestSpyObj(oneSignalServiceMethods);
}

export {
  spyCacheService,
  spyCameraService,
  spyOneSignalService,
};
