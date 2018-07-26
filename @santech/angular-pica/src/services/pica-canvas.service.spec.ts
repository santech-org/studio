import { TestBed } from '@angular/core/testing';
import { SantechCommonModule } from '@santech/angular-common';
import { PLATFORM_DOCUMENT, SantechPlatformModule } from '@santech/angular-platform';
import { SantechPicaModule } from '..';
import { spyCanvas, spyCtx, spyDocument } from '../../testing';
import { PicaCanvasService } from './pica-canvas.service';

describe('PicaCanvasService', () => {
  let service: PicaCanvasService;

  beforeEach(() => {
    service = TestBed
      .configureTestingModule({
        imports: [
          SantechPlatformModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPicaModule.forRoot(),
        ],
        providers: [
          { provide: PLATFORM_DOCUMENT, useValue: spyDocument }],
      })
      .get(PicaCanvasService);
  });

  describe('When canvas is fully supported', () => {
    it('Should provide a canvas', () => {
      expect(service.getCanvas()).toEqual({
        canvas: spyCanvas,
        ctx: spyCtx,
      });
    });
  });

  describe('When canvas is not fully supported', () => {
    beforeEach(() => {
      spyDocument.createElement
        .mockImplementation((tag) => tag === 'canvas' ? spyCanvas : null);
      spyCanvas.getContext.mockReturnValue(null);
    });

    it('Should throw an error', () => {
      expect(() => service.getCanvas())
        .toThrow(`PicaCanvasService(getCanvas): canvas context identifier not supported`);
    });
  });
});
