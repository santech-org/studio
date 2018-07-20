import { Injectable } from '@angular/core';
import { Camera, DestinationType, EncodingType, MediaType, PictureSourceType } from '@ionic-native/camera';
import { File as IonicFile } from '@ionic-native/file';
import { FileService } from '@santech/angular-common';
import { Platform } from 'ionic-angular';
import { ICameraOptions } from '../interfaces/camera';
import { cordovaPlatform } from '../models/cordova';

@Injectable()
export class CameraService {
  private _camera: Camera;
  private _platform: Platform;
  private _file: IonicFile;
  private _fileService: FileService;

  constructor(camera: Camera, platform: Platform, file: IonicFile, fileService: FileService) {
    this._camera = camera;
    this._platform = platform;
    this._file = file;
    this._fileService = fileService;
  }

  public async takePicture(options: ICameraOptions, input: HTMLInputElement): Promise<File> {
    const p = await this._platform.ready();
    switch (p) {
      case cordovaPlatform:
        return this._getCameraFile(options);
      default:
        return this._getInputFile(input);
    }
  }

  private async _getCameraFile(options: ICameraOptions): Promise<File> {
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

    const file = await this._file.readAsArrayBuffer(path, name);
    return this._fileService.createFile([file], name);
  }

  private _getInputFile(input: HTMLInputElement): Promise<File> {
    return new Promise<File>((res, rej) => {
      input.addEventListener('change', (event: Event) => {
        const { files } = event.target as HTMLInputElement;
        if (files && files.length) {
          return res(files[0]);
        }

        return rej(new Error('CameraService(_getInputFile): no file selected'));
      });

      input.click();
    });
  }
}
