import { TranslatePipe } from '@ngx-translate/core';
import { LocalesService } from '@santech/angular-i18n';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export const localesServiceMethods = Object
  .getOwnPropertyNames(LocalesService.prototype).filter(filterPrivate);

export const translatePipeMethods = ['transform'];

let spyLocalesService: SantechSpyObject<LocalesService>;
let spyTranslatePipe: SantechSpyObject<TranslatePipe>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyLocalesService = jasmine.createSpyObj('spyLocalesService', localesServiceMethods);
  spyTranslatePipe = jasmine.createSpyObj('spyTranslatePipe', translatePipeMethods);
} else if (typeof jest !== 'undefined') {
  spyLocalesService = createJestSpyObj(localesServiceMethods);
  spyTranslatePipe = createJestSpyObj(translatePipeMethods);
}

export {
  spyLocalesService,
  spyTranslatePipe,
};
