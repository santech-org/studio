import { Inject, Injectable } from '@angular/core';
import { FileService } from '@santech/angular-common';
import { NgxPicaService } from 'ngx-pica';
import { IResizeParams } from '../interfaces/images';
import { IMG_MAX_HEIGHT, IMG_MAX_WIDTH } from '../tokens/image-options';
import { IMG_REGEX } from '../tokens/image-regex';

@Injectable()
export class ImageService {
  private _fileService: FileService;
  private _picaService: NgxPicaService;
  private _imgReg: RegExp;
  private _imgMaxHeight: number;
  private _imgMaxWidth: number;

  constructor(
    fileService: FileService,
    picaService: NgxPicaService,
    @Inject(IMG_REGEX) imgReg: RegExp,
    @Inject(IMG_MAX_HEIGHT) imgMaxHeight: number,
    @Inject(IMG_MAX_WIDTH) imgMaxWidth: number,
  ) {
    this._fileService = fileService;
    this._picaService = picaService;
    this._imgReg = imgReg;
    this._imgMaxHeight = imgMaxHeight;
    this._imgMaxWidth = imgMaxWidth;
  }

  public hasWrongExtension(file: File) {
    return !this._imgReg.test(file.name);
  }

  public resizeImage(
    file: File,
    {height, width}: IResizeParams = { height: this._imgMaxHeight, width: this._imgMaxWidth },
  ) {
    return new Promise<File>((res, rej) => {
      const subscription = this._picaService.resizeImage(
        file, width, height,
        {
          aspectRatio: {
            keepAspectRatio: true,
          },
        },
      ).subscribe(
        (resizedImg) => {
          subscription.unsubscribe();
          res(resizedImg);
        },
        () => rej(new Error('ImageService(resizeImage): unable to resize image')),
      );
    });
  }

  public async resizeImageToBase64(
    file: File,
    params?: IResizeParams,
  ) {
    const resizedFile = await this.resizeImage(file, params);
    return this._fileService.readFile(resizedFile);
  }
}
