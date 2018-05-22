import { ImageService } from '@santech/angular-cropper';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';
import { ImageCropper } from 'ngx-img-cropper';

export const imageCropperMethods = ['getCroppedImageHelper'];

export const santechImageServiceMethods = Object
  .getOwnPropertyNames(ImageService.prototype).filter(filterPrivate);

let spyImageService: SantechSpyObject<ImageService>;
let spyImageCropper: SantechSpyObject<ImageCropper>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyImageService = jasmine.createSpyObj('spyImageService', santechImageServiceMethods);
  spyImageCropper = jasmine.createSpyObj('spyImageCropper', imageCropperMethods);
} else if (typeof jest !== 'undefined') {
  spyImageService = createJestSpyObj(santechImageServiceMethods);
  spyImageCropper = createJestSpyObj(imageCropperMethods);
}

export {
  spyImageService,
  spyImageCropper,
};
