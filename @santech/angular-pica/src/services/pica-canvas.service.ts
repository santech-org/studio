import { Inject, Injectable } from '@angular/core';
import { PLATFORM_DOCUMENT } from '@santech/angular-platform';

@Injectable()
export class PicaCanvasService {
  private _document: typeof document;

  constructor(@Inject(PLATFORM_DOCUMENT) platformDocument: any) {
    this._document = platformDocument;
  }

  public getCanvas() {
    const canvas: HTMLCanvasElement = this._document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error(`PicaCanvasService(getCanvas): canvas context identifier not supported`);
    }

    return {
      canvas,
      ctx,
    };
  }
}
