import { Inject, Injectable } from '@angular/core';
import { PicaService, TPicaInput } from '@santech/angular-pica';
import { IMG_MAX_HEIGHT, IMG_MAX_WIDTH } from '../tokens/image-options';
import { IMG_REGEX } from '../tokens/image-regex';

@Injectable()
export class ResizeService {
  private _picaService: PicaService;
  private _imgReg: RegExp;
  private _imgMaxHeight: number;
  private _imgMaxWidth: number;

  constructor(
    picaService: PicaService,
    @Inject(IMG_REGEX) imgReg: RegExp,
    @Inject(IMG_MAX_HEIGHT) imgMaxHeight: number,
    @Inject(IMG_MAX_WIDTH) imgMaxWidth: number,
  ) {
    this._picaService = picaService;
    this._imgReg = imgReg;
    this._imgMaxHeight = imgMaxHeight;
    this._imgMaxWidth = imgMaxWidth;
  }

  public hasWrongExtension(file: File) {
    return !this._imgReg.test(file.name);
  }

  public resizeImage<T extends TPicaInput>(
    data: T,
    height: number = this._imgMaxHeight,
    width: number = this._imgMaxWidth,
  ) {
    return new Promise<T>(async (res, rej) => {
      try {
        const resizedImg = await this._picaService.resizeImage<T>(
          {data, width, height},
          {
            aspectRatio: {
              keepAspectRatio: true,
            },
          });
        res(resizedImg);
      } catch (e) {
        rej(e);
      }
    });
  }
}
