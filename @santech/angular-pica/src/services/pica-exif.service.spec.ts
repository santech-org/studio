import { TestBed } from '@angular/core/testing';
import { SantechCommonModule } from '@santech/angular-common';
import { PLATFORM_DOCUMENT, SantechPlatformModule } from '@santech/angular-platform';
import { SantechPicaModule } from '..';
import { spyCanvas, spyCtx, spyDocument, spyExif } from '../../testing';
import { EXIF } from '../tokens/exif.token';
import { PicaExifService } from './pica-exif.service';

const width = 1024;
const height = 768;
const base64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const orientationParams: { [orientation: string]: number[] } = {
  1: [1, 0, 0, 1, 0, 0],
  2: [-1, 0, 0, 1, width, 0],
  3: [-1, 0, 0, -1, width, height],
  4: [1, 0, 0, -1, 0, height],
  5: [0, 1, 1, 0, 0, 0],
  6: [0, 1, -1, 0, height, 0],
  7: [0, -1, -1, 0, height, width],
  8: [0, -1, 1, 0, 0, width],
};

describe('PicaService', () => {
  let service: PicaExifService;

  beforeEach(() => {
    spyCanvas.toDataURL
      .mockReturnValue(base64);

    spyExif.getData.mockImplementation((_, cb: () => void) => cb() && true);

    service = TestBed
      .configureTestingModule({
        imports: [
          SantechPlatformModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPicaModule.forRoot({
            exifProvider: {
              provide: EXIF,
              useValue: spyExif,
            },
          }),
        ],
        providers: [
          { provide: PLATFORM_DOCUMENT, useValue: spyDocument }],
      })
      .get(PicaExifService);
  });

  describe('When I orient image', () => {
    it('Should transform canvas', async () => {
      Object.keys(orientationParams)
        .forEach(async (k) => {
          const orientation = parseInt(k, 10);
          spyExif.getAllTags.mockReturnValue({ Orientation: orientation });
          const image = new Image();
          image.width = width;
          image.height = height;
          const oriented = await service.getExifOrientedData(image);
          expect(oriented).toBe(base64);
          expect(spyCtx.transform).toHaveBeenCalledWith(...orientationParams[k]);
        });
    });
  });
});
