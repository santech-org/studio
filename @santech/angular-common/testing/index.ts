import { Router } from '@angular/router';
import { LoggerService } from '@santech/angular-common';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export * from './mocks/timeout-mock';

export const routerMethods = ['navigate'];

export const loggerServiceMethods = Object
  .getOwnPropertyNames(LoggerService.prototype).filter(filterPrivate);

let spyLoggerService: SantechSpyObject<LoggerService>;
let spyRouter: SantechSpyObject<Router>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyLoggerService = jasmine.createSpyObj('spyLoggerService', loggerServiceMethods);
  spyRouter = jasmine.createSpyObj('spyRouter', routerMethods);
} else if (typeof jest !== 'undefined') {
  spyLoggerService = createJestSpyObj(loggerServiceMethods);
  spyRouter = createJestSpyObj(routerMethods);
}

export {
  spyLoggerService,
  spyRouter,
};
