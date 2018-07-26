import { Inject, Injectable } from '@angular/core';
import * as exifJs from 'exif-js';
import { EXIF } from '../tokens/exif.token';
import { PicaCanvasService } from './pica-canvas.service';

@Injectable()
export class PicaExifService {
  private static swapOrientations = [5, 6, 7, 8];

  private _canvasService: PicaCanvasService;
  private _exif: typeof exifJs;

  constructor(canvasService: PicaCanvasService, @Inject(EXIF) exif: any) {
    this._canvasService = canvasService;
    this._exif = exif;
  }

  public async getExifOrientedData(image: HTMLImageElement) {
    return new Promise<string>(async (res, rej) => {
      const { canvas, ctx } = this._canvasService.getCanvas();
      const { width, height } = image;

      try {
        const orientation = await this._getImageOrientation(image);

        if (PicaExifService.swapOrientations.indexOf(orientation) > -1) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, width, height);
            break;
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, height, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, height, width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, width);
            break;
          default:
            ctx.transform(1, 0, 0, 1, 0, 0);
        }
      } catch (e) {
        if (e !== image) {
          return rej(e);
        }
      }

      ctx.drawImage(image, 0, 0, width, height);

      return res(canvas.toDataURL());
    });
  }

  private async _getImageOrientation(image: HTMLImageElement) {
    const exif = this._exif;
    return new Promise<number>((res, rej) => exif
      // signature is string in d.ts but real HTMLImageElement
      // BTW callback is sync !!!!
      .getData(image as any, () => {
        try {
          const orientation = exif.getAllTags(image).Orientation;
          return orientation ? res(orientation) : rej(image);
        } catch {
          rej(image);
        }
      }) || rej(image));
  }
}
