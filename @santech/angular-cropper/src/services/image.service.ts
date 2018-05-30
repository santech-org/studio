import { Inject, Injectable } from '@angular/core';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { ICropperImage, TCropperSettingsFactory } from '../interfaces/cropper';
import { CROPPER_SETTINGS_FACTORY } from '../tokens/cropper-settings-factory';
import { IMG_REGEX } from '../tokens/image-regex';
import { FileService } from './file.service';

@Injectable()
export class ImageService {
  private _fileService: FileService;
  private _settingsFactory: TCropperSettingsFactory;
  private _imgReg: RegExp;

  constructor(
    fileService: FileService,
    @Inject(IMG_REGEX) imgReg: RegExp,
    @Inject(CROPPER_SETTINGS_FACTORY) settingsFactory: any) {
    this._fileService = fileService;
    this._settingsFactory = settingsFactory;
    this._imgReg = imgReg;
  }

  public hasWrongExtension(file: File) {
    return !this._imgReg.test(file.name);
  }

  public getCropperSettings(image?: ICropperImage): CropperSettings {
    return this._settingsFactory(image);
  }

  public async getCropperImageFromFile(file: File) {
    const result = await this._fileService.readFile(file);
    return this.getCropperImage(result);
  }

  public getCropperImage(src: string) {
    const image = new Image();
    return new Promise<ICropperImage>((res, rej) => {
      image.onload = () => res(image);
      image.onerror = (err) => rej(err);
      image.src = src;
    });
  }

  public cropImage(cropperCpt: ImageCropperComponent) {
    const cropper = cropperCpt.cropper;
    cropper.setImage(cropperCpt.image);
    return cropper.getCroppedImageHelper().src;
  }
}
