import { CacheService, CameraService } from '@santech/angular-ionic';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export * from './ionic';

export const cacheServiceMethods = Object
  .getOwnPropertyNames(CacheService.prototype).filter(filterPrivate);

export const cameraServiceMethods = Object
  .getOwnPropertyNames(CameraService.prototype).filter(filterPrivate);

let spyCacheService: SantechSpyObject<CacheService>;
let spyCameraService: SantechSpyObject<CameraService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyCacheService = jasmine.createSpyObj('spyCacheService', cacheServiceMethods);
  spyCameraService = jasmine.createSpyObj('spy  CameraService', cameraServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyCacheService = createJestSpyObj(cacheServiceMethods);
  spyCameraService = createJestSpyObj(cameraServiceMethods);
}

export {
  spyCacheService,
  spyCameraService,
};
