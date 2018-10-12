import { EventEmitter } from '@angular/core';
import { Direction, PictureSourceType } from '@ionic-native/camera/ngx';

export interface ICameraImage {
  base64: string;
  name: string;
}

export interface ICameraDirective {
  options: ICameraOptions;
  pictureProcess: EventEmitter<void>;
}

export interface ICameraOptions {
  quality?: number | undefined;
  cameraDirection?: Direction.BACK | Direction.FRONT | undefined;
  sourceType?: PictureSourceType.CAMERA | PictureSourceType.PHOTOLIBRARY;
  targetHeight?: number | undefined;
  targetWidth?: number | undefined;
}

export interface ICameraImageParams extends ICameraOptions {
  name: string;
}
