import { Inject, Injectable } from '@angular/core';
import { FileService } from '@santech/angular-common';
import { PLATFORM_IMAGE } from '@santech/angular-platform';
import { TPicaInput } from '../interfaces/input';
import { PicaExifService } from './pica-exif.service';

@Injectable()
export class PicaImageService {
  private _exifService: PicaExifService;
  private _createImage: (src: string) => Promise<HTMLImageElement>;
  private _fileService: FileService;

  constructor(
    exifService: PicaExifService,
    fileService: FileService,
    @Inject(PLATFORM_IMAGE) platformImage: any,
  ) {
    this._exifService = exifService;
    this._fileService = fileService;
    this._createImage = this._setImageConstructor(platformImage);
  }

  public async getOrientedImage(input: TPicaInput) {
    return new Promise<HTMLImageElement>(async (res, rej) => {
      try {
        const src = await this._getImageSrc(input);
        const image = await this._createImage(src);
        return res(this._orientImage(image));
      } catch (e) {
        return rej(e);
      }
    });
  }

  public blobToFile(blob: Blob, name: string) {
    return this._fileService.createFile([blob], name);
  }

  private _setImageConstructor(imageConstructor: typeof Image) {
    return (src: string) => new Promise<HTMLImageElement>((res, rej) => {
      const img = new imageConstructor();
      img.onload = () => res(img);
      img.onerror = (e) => rej(e);
      img.src = src;
    });
  }

  private async _orientImage(img: HTMLImageElement) {
    return new Promise<HTMLImageElement>(async (res, rej) => {
      try {
        const src = await this._exifService.getExifOrientedData(img);
        const image = await this._createImage(src);
        return res(image);
      } catch (e) {
        return rej(e);
      }
    });
  }

  private _getImageSrc(input: TPicaInput) {
    return typeof input === 'string'
      ? Promise.resolve(input)
      : this._fileService.readImageFile(input);
  }
}
