import { CameraService, OneSignalService, RepositoryService } from '@santech/angular-ionic';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export * from './ionic';

export const cacheServiceMethods = Object
  .getOwnPropertyNames(RepositoryService.prototype).filter(filterPrivate);

export const cameraServiceMethods = Object
  .getOwnPropertyNames(CameraService.prototype).filter(filterPrivate);

export const oneSignalServiceMethods = Object
  .getOwnPropertyNames(OneSignalService.prototype).filter(filterPrivate);

let spyCameraService: SantechSpyObject<CameraService>;
let spyOneSignalService: SantechSpyObject<OneSignalService>;
let spyRepositoryService: SantechSpyObject<RepositoryService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyCameraService = jasmine.createSpyObj('spyCameraService', cameraServiceMethods);
  spyOneSignalService = jasmine.createSpyObj('spyOneSignalService', oneSignalServiceMethods);
  spyRepositoryService = jasmine.createSpyObj('spyCacheService', cacheServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyCameraService = createJestSpyObj(cameraServiceMethods);
  spyOneSignalService = createJestSpyObj(oneSignalServiceMethods);
  spyRepositoryService = createJestSpyObj(cacheServiceMethods);
}

export {
  spyCameraService,
  spyOneSignalService,
  spyRepositoryService,
};
