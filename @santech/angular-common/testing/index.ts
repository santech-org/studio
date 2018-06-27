import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FileService, LoggerService } from '@santech/angular-common';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export * from './mocks/timeout-mock';

export const fileServiceMethods = Object
  .getOwnPropertyNames(FileService.prototype).filter(filterPrivate);
export const locationMethods = ['back'];
export const loggerServiceMethods = Object
  .getOwnPropertyNames(LoggerService.prototype).filter(filterPrivate);
export const routerMethods = ['navigate'];

let spyFileService: SantechSpyObject<FileService>;
let spyLocation: SantechSpyObject<Location>;
let spyLoggerService: SantechSpyObject<LoggerService>;
let spyRouter: SantechSpyObject<Router>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyFileService = jasmine.createSpyObj('spyFileService', fileServiceMethods);
  spyLocation = jasmine.createSpyObj('spyLocation', locationMethods);
  spyLoggerService = jasmine.createSpyObj('spyLoggerService', loggerServiceMethods);
  spyRouter = jasmine.createSpyObj('spyRouter', routerMethods);
} else if (typeof jest !== 'undefined') {
  spyFileService = createJestSpyObj(fileServiceMethods);
  spyLocation = createJestSpyObj(locationMethods);
  spyLoggerService = createJestSpyObj(loggerServiceMethods);
  spyRouter = createJestSpyObj(routerMethods);
}

export {
  spyFileService,
  spyLocation,
  spyRouter,
  spyLoggerService,
};
