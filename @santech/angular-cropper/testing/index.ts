import { ResizeService } from '@santech/angular-cropper';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export const resizeServiceMethods = Object
  .getOwnPropertyNames(ResizeService.prototype).filter(filterPrivate);

let spyResizeService: SantechSpyObject<ResizeService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyResizeService = jasmine.createSpyObj('spyResizeService', resizeServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyResizeService = createJestSpyObj(resizeServiceMethods);
}

export {
  spyResizeService,
};
