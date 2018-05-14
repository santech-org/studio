import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CropperSettings } from 'ngx-img-cropper';
import { ICropperImage } from './interfaces/cropper';
import { FileService } from './services/file.service';
import { ImageService } from './services/image.service';
import { IMG_REGEX } from './tokens/image-regex';

export * from './services/file.service';
export * from './services/image.service';
export * from './interfaces/cropper';
export * from './interfaces/images';
export * from './tokens/cropper-settings-factory';
export * from './tokens/image-regex';

export function avatarCropperSettingsFactory() {
  return new CropperSettings({
    canvasHeight: 300,
    canvasWidth: 300,
    compressRatio: 0.9,
    croppedHeight: 500,
    croppedWidth: 500,
    height: 300,
    noFileInput: true,
    rounded: false,
    width: 300,
  });
}

export function pictureCropperSettingsFactory(image?: ICropperImage) {
  if (!image) {
    throw new Error('SantechCropperModule(CropperSettingsFactory): image must be defined');
  }

  const naturalHeight = image.naturalHeight;
  let height = naturalHeight;
  const naturalWidth = image.naturalWidth;
  let width = naturalWidth;

  if (naturalWidth > naturalHeight && naturalWidth > 1920) {
    height = naturalHeight / naturalWidth * 1920;
    width = 1920;
  } else if (naturalHeight > 1920) {
    width = naturalWidth / naturalHeight * 1920;
    height = 1920;
  }

  return new CropperSettings({
    canvasHeight: height,
    canvasWidth: width,
    compressRatio: 0.9,
    croppedHeight: height,
    croppedWidth: width,
    height,
    noFileInput: true,
    rounded: false,
    width,
  });
}

export function imgRegExFactory() {
  return new RegExp('\.(png|jpe?g|gif)$', 'i');
}

@NgModule({
  providers: [
    FileService,
    ImageService,
    {
      provide: IMG_REGEX,
      useFactory: imgRegExFactory,
    },
  ],
})
export class SantechCropperModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechCropperModule,
    };
  }

  public static forRoot(cropperSettingsProvider: Provider): ModuleWithProviders {
    return {
      ngModule: SantechCropperModule,
      providers: [
        cropperSettingsProvider,
      ],
    };
  }
}
