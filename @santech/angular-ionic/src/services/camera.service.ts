import { Injectable } from '@angular/core';
import { Camera, DestinationType, EncodingType, MediaType, PictureSourceType } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileService } from '@santech/angular-cropper';
import { Platform } from 'ionic-angular';
import { ICameraImage, ICameraOptions } from '../interfaces/camera';
import { cordovaPlatform } from '../models/cordova';

@Injectable()
export class CameraService {
  private _camera: Camera;
  private _platform: Platform;
  private _file: File;
  private _fileService: FileService;

  constructor(camera: Camera, platform: Platform, file: File, fileService: FileService) {
    this._camera = camera;
    this._platform = platform;
    this._file = file;
    this._fileService = fileService;
  }

  public takePicture(options: ICameraOptions, input: HTMLInputElement): Promise<ICameraImage> {
    return this._platform.ready()
      .then((p) => {
        switch (p) {
          case cordovaPlatform:
            return this._getCameraPicture(options);
          default:
            return this._getInputPicture(input);
        }
      });
  }

  private _getCameraPicture(options: ICameraOptions): Promise<ICameraImage> {
    return this._camera.getPicture({
      allowEdit: true,
      correctOrientation: true,
      destinationType: DestinationType.FILE_URL,
      encodingType: EncodingType.JPEG,
      mediaType: MediaType.PICTURE,
      quality: 80,
      saveToPhotoAlbum: false,
      sourceType: PictureSourceType.PHOTOLIBRARY,
      ...options,
    })
    .then((fullPath: string) => {
      const path = fullPath.slice(0, fullPath.lastIndexOf('/') + 1);
      const name = fullPath
        .replace(path, '')
        .replace(/\?\d+$/, '');
      return this._file.readAsDataURL(path, name)
        .then((base64) => ({ base64, name }));
    });
  }

  private _getInputPicture(input: HTMLInputElement): Promise<ICameraImage> {
    return new Promise<ICameraImage>((res, rej) => {
      input.addEventListener('change', (event: Event) => {
        this._fileSelected(event)
          .then((image) => res(image))
          .catch((error) => rej(error));
      });
      input.click();
    });
  }

  private _fileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      return this._fileService.readFile(file).then((base64) => ({base64, name: file.name}));
    }

    throw new Error('CameraService(_fileSelected): no file selected');
  }
}
