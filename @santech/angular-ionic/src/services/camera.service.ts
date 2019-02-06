import { Inject, Injectable } from '@angular/core';
import { Camera, DestinationType, EncodingType, MediaType, PictureSourceType } from '@ionic-native/camera';
import { File as IonicFile } from '@ionic-native/file';
import { FileService } from '@santech/angular-common';
import { ResizeService } from '@santech/angular-cropper';
import { PLATFORM_DOCUMENT } from '@santech/angular-platform';
import { Platform } from 'ionic-angular';
import { ICameraDirective, ICameraImage, ICameraImageParams } from '../interfaces/camera';
import { cameraErrorEnum } from '../models/camera';
import { cordovaPlatform } from '../models/cordova';

@Injectable()
export class CameraService {
  private _camera: Camera;
  private _file: IonicFile;
  private _fileService: FileService;
  private _resizeService: ResizeService;
  private _platform: Platform;
  private _document: Document;

  constructor(
    camera: Camera,
    file: IonicFile,
    fileService: FileService,
    resizeService: ResizeService,
    platform: Platform,
    @Inject(PLATFORM_DOCUMENT) document: any,
  ) {
    this._camera = camera;
    this._file = file;
    this._fileService = fileService;
    this._resizeService = resizeService;
    this._platform = platform;
    this._document = document;
  }

  public async takePicture(directive: ICameraDirective): Promise<ICameraImage> {
    const p = await this._platform.ready();
    switch (p) {
      case cordovaPlatform:
        return this._getCameraPicture(directive);
      default:
        return this._getInputPicture(directive);
    }
  }

  private async _getCameraPicture({ options, pictureProcess }: ICameraDirective): Promise<ICameraImage> {
    try {
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

      pictureProcess.emit();
      const path = fullPath.slice(0, fullPath.lastIndexOf('/') + 1);
      const name = fullPath
        .replace(path, '')
        .replace(/\?\d+$/, '');

      return this._resolveCameraImage({
        ...options,
        name,
      }, this._file.readAsDataURL(path, name));
    } catch (e) {
      if (typeof e !== 'string') {
        throw e;
      }

      switch (e.toLowerCase()) {
        case cameraErrorEnum.noImageSelected:
          return Promise.reject(e);
        default:
          throw new Error(e);
      }
    }
  }

  private _getInputPicture({ options, pictureProcess }: ICameraDirective): Promise<ICameraImage> {
    return new Promise<ICameraImage>((res, rej) => {
      const input: HTMLInputElement = this._document.createElement('input');
      input.type = 'file';

      const change = (event: Event) => {
        const { files } = event.target as HTMLInputElement;

        input.removeEventListener('change', change);

        if (!files || !files.length) {
          return rej();
        }

        pictureProcess.emit();

        const file = files[0];

        res(this._resolveCameraImage(
          {
            ...options,
            name: file.name,
          },
          this._fileService.readImageFile(file)),
        );
      };

      input.addEventListener('change', change);

      input.click();
    });
  }

  private async _resolveCameraImage(
    { name, targetHeight, targetWidth }: ICameraImageParams,
    base64Promise: Promise<string>,
  ) {
    const data = await base64Promise;
    const base64 = await this._resizeService.resizeImage(data, targetHeight, targetWidth);
    return {
      base64,
      name,
    };
  }
}
