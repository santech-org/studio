import { CameraService, FileCacheService, OneSignalService } from '@santech/angular-ionic';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export * from './ionic';

export const cameraServiceMethods = Object
  .getOwnPropertyNames(CameraService.prototype).filter(filterPrivate);

export const fileCacheServiceMethods = Object
  .getOwnPropertyNames(FileCacheService.prototype).filter(filterPrivate);

export const oneSignalServiceMethods = Object
  .getOwnPropertyNames(OneSignalService.prototype).filter(filterPrivate);

let spyCameraService: SantechSpyObject<CameraService>;
let spyFileCacheService: SantechSpyObject<FileCacheService>;
let spyOneSignalService: SantechSpyObject<OneSignalService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyCameraService = jasmine.createSpyObj('spyCameraService', cameraServiceMethods);
  spyFileCacheService = jasmine.createSpyObj('spyFileCacheService', fileCacheServiceMethods);
  spyOneSignalService = jasmine.createSpyObj('spyOneSignalService', oneSignalServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyCameraService = createJestSpyObj(cameraServiceMethods);
  spyFileCacheService = createJestSpyObj(fileCacheServiceMethods);
  spyOneSignalService = createJestSpyObj(oneSignalServiceMethods);
}

export {
  spyCameraService,
  spyFileCacheService,
  spyOneSignalService,
};
