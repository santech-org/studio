import { Inject, Injectable } from '@angular/core';
import * as Pica from 'pica';
import { TPicaInput } from '../interfaces/input';
import { IPicaResizeCanvas, IPicaResizeOptions, IPicaResizeParams } from '../interfaces/param';
import { PICA } from '../tokens/pica.token';
import { PicaCanvasService } from './pica-canvas.service';
import { PicaImageService } from './pica-image.service';

@Injectable()
export class PicaService {
  private _canvasService: PicaCanvasService;
  private _imageService: PicaImageService;
  private _pica: typeof Pica;

  constructor(canvasService: PicaCanvasService, imageService: PicaImageService, @Inject(PICA) pica: any) {
    this._canvasService = canvasService;
    this._imageService = imageService;
    this._pica = pica;
  }

  public async resizeImage<T extends TPicaInput>(
    { data, height, width }: IPicaResizeParams<T>,
    options: IPicaResizeOptions = {},
  ) {
    return new Promise<T>(async (res, rej) => {
      try {
        const { canvas: from, ctx } = this._canvasService.getCanvas();
        const orientedImage = await this._imageService.getOrientedImage(data);

        from.width = orientedImage.width;
        from.height = orientedImage.height;
        ctx.drawImage(orientedImage, 0, 0);

        const { aspectRatio } = options;

        if (aspectRatio && aspectRatio.keepAspectRatio) {
          const imageData = ctx.getImageData(0, 0, orientedImage.width, orientedImage.height);
          const ratio = aspectRatio.forceMinDimensions
            ? Math.max(width / imageData.width, height / imageData.height)
            : Math.min(width / imageData.width, height / imageData.height);

          width = Math.round(imageData.width * ratio);
          height = Math.round(imageData.height * ratio);
        }

        const { canvas: to } = this._canvasService.getCanvas();

        to.width = width;
        to.height = height;
        return res(this._picaResize({ data, from, to }, options) as Promise<T>);
      } catch (e) {
        return rej(e);
      }
    });
  }

  private _picaResize({ data, from, to }: IPicaResizeCanvas<TPicaInput>, options?: IPicaResizeOptions) {
    const pica = this._pica;
    return new Promise<TPicaInput>(async (res, rej) => {
      try {
        const canvas: HTMLCanvasElement = pica.resize(from, to, options);
        if (typeof data === 'string') {
          return res(canvas.toDataURL());
        }
        const blob = await pica.toBlob(canvas, data.type);
        return res(this._imageService.blobToFile(blob, data.name));
      } catch (e) {
        return rej(e);
      }
    });
  }
}
