import { Inject, Injectable } from '@angular/core';
import * as Pica from 'pica';
import { TPicaInput } from '../interfaces/input';
import { IPicaResizeCanvas, IPicaResizeOptions, IPicaResizeParams } from '../interfaces/param';
import { IMAGE_FORMAT } from '../tokens/image-format.token';
import { PICA } from '../tokens/pica.token';
import { PicaCanvasService } from './pica-canvas.service';
import { PicaImageService } from './pica-image.service';

@Injectable()
export class PicaService {
  private _canvasService: PicaCanvasService;
  private _imageService: PicaImageService;
  private _imageFormat: string;
  private _pica: typeof Pica;

  constructor(
    canvasService: PicaCanvasService,
    imageService: PicaImageService,
    @Inject(IMAGE_FORMAT) imageFormat: string,
    @Inject(PICA) pica: any,
  ) {
    this._canvasService = canvasService;
    this._imageService = imageService;
    this._imageFormat = imageFormat;
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
        const canvas: HTMLCanvasElement = await pica.resize(from, to, options);
        if (typeof data === 'string') {
          return res(canvas.toDataURL(this._imageFormat));
        }
        const { name, type } = data;
        const blob = await pica.toBlob(canvas, type);
        return res(this._imageService.blobToFile(blob, name, type));
      } catch (e) {
        return rej(e);
      }
    });
  }
}
