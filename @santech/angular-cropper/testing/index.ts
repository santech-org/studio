import { ImageService } from '@santech/angular-cropper';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';
import { ImageCropper } from 'ngx-img-cropper';

export const imageCropperMethods = ['getCroppedImageHelper'];

export const santechImageServiceMethods = Object
  .getOwnPropertyNames(ImageService.prototype).filter(filterPrivate);

let spySantechImageService: SantechSpyObject<ImageService>;
let spyImageCropper: SantechSpyObject<ImageCropper>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spySantechImageService = jasmine.createSpyObj('spySantechImageService', santechImageServiceMethods);
  spyImageCropper = jasmine.createSpyObj('spyImageCropper', imageCropperMethods);
} else if (typeof jest !== 'undefined') {
  spySantechImageService = createJestSpyObj(santechImageServiceMethods);
  spyImageCropper = createJestSpyObj(imageCropperMethods);
}

export {
  spySantechImageService,
  spyImageCropper,
};
