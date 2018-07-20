import { Router } from '@angular/router';
import { FileService, LoggerService } from '@santech/angular-common';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export * from './mocks/timeout-mock';

export const routerMethods = ['navigate'];

export const loggerServiceMethods = Object
  .getOwnPropertyNames(LoggerService.prototype).filter(filterPrivate);
export const fileServiceMethods = Object
  .getOwnPropertyNames(FileService.prototype).filter(filterPrivate);

let spyLoggerService: SantechSpyObject<LoggerService>;
let spyRouter: SantechSpyObject<Router>;
let spyFileService: SantechSpyObject<FileService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyLoggerService = jasmine.createSpyObj('spyLoggerService', loggerServiceMethods);
  spyRouter = jasmine.createSpyObj('spyRouter', routerMethods);
  spyFileService = jasmine.createSpyObj('spyFileService', fileServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyLoggerService = createJestSpyObj(loggerServiceMethods);
  spyRouter = createJestSpyObj(routerMethods);
  spyFileService = createJestSpyObj(fileServiceMethods);
}

export {
  spyLoggerService,
  spyRouter,
  spyFileService,
};
