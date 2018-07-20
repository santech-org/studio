import { ImageService } from '@santech/angular-cropper';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export const imageCropperMethods = ['getCroppedImageHelper'];

export const santechImageServiceMethods = Object
  .getOwnPropertyNames(ImageService.prototype).filter(filterPrivate);

let spyImageService: SantechSpyObject<ImageService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyImageService = jasmine.createSpyObj('spyImageService', santechImageServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyImageService = createJestSpyObj(santechImageServiceMethods);
}

export {
  spyImageService,
};
