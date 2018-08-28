import { Injectable } from '@angular/core';
import { Camera, DestinationType, EncodingType, MediaType, PictureSourceType } from '@ionic-native/camera/ngx';
import { File as IonicFile } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { FileService } from '@santech/angular-common';
import { ResizeService } from '@santech/angular-cropper';
import { ICameraImage, ICameraOptions } from '../interfaces/camera';
import { cordovaPlatform } from '../models/cordova';

@Injectable()
export class CameraService {
  private _camera: Camera;
  private _file: IonicFile;
  private _fileService: FileService;
  private _resizeService: ResizeService;
  private _platform: Platform;

  constructor(
    camera: Camera,
    file: IonicFile,
    fileService: FileService,
    resizeService: ResizeService,
    platform: Platform,
  ) {
    this._camera = camera;
    this._file = file;
    this._fileService = fileService;
    this._resizeService = resizeService;
    this._platform = platform;
  }

  public async takePicture(options: ICameraOptions, input: HTMLInputElement): Promise<ICameraImage> {
    const p = await this._platform.ready();
    switch (p) {
      case cordovaPlatform:
        return this._getCameraPicture(options);
      default:
        return this._getInputPicture(options, input);
    }
  }

  private async _getCameraPicture(options: ICameraOptions): Promise<ICameraImage> {
    const fullPath = await this._camera.getPicture({
      allowEdit: true,
      correctOrientation: true,
      destinationType: DestinationType.FILE_URL,
      encodingType: EncodingType.JPEG,
      mediaType: MediaType.PICTURE,
      quality: 80,
      saveToPhotoAlbum: false,
      sourceType: PictureSourceType.PHOTOLIBRARY,
      ...options,
    });

    const path = fullPath.slice(0, fullPath.lastIndexOf('/') + 1);
    const name = fullPath
      .replace(path, '')
      .replace(/\?\d+$/, '');

    const data = await this._file.readAsDataURL(path, name);
    const base64 = await this._resizePicture(data, options.targetHeight, options.targetWidth);
    return ({
      base64,
      name,
    });
  }

  private _getInputPicture(
    {targetHeight, targetWidth}: ICameraOptions,
    input: HTMLInputElement,
  ): Promise<ICameraImage> {
    return new Promise<ICameraImage>((res, rej) => {
      input.addEventListener('change', async (event: Event) => {
        const { files } = event.target as HTMLInputElement;

        if (!files || !files.length) {
          return rej(new Error('CameraService(_getInputPicture): no file selected'));
        }

        const file = files[0];
        const data = await this._fileService.readImageFile(file);
        const base64 = await this._resizePicture(data, targetHeight, targetWidth);
        return res({
          base64,
          name: file.name,
        });
      });

      input.click();
    });
  }

  private _resizePicture(data: string, height?: number, width?: number) {
    return this._resizeService.resizeImage(data, height, width);
  }
}
