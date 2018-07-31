import { TestBed } from '@angular/core/testing';
import { SantechCommonModule } from '@santech/angular-common';
import { PLATFORM_DOCUMENT, SantechPlatformModule } from '@santech/angular-platform';
import { SantechPicaModule } from '..';
import { spyCanvas, spyDocument, spyExif, spyPica } from '../../testing';
import { EXIF } from '../tokens/exif.token';
import { PICA } from '../tokens/pica.token';
import { PicaService } from './pica.service';

const base64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const image = new File([''], 'image.png');

describe('PicaService', () => {
  let service: PicaService;

  beforeEach(() => {
    spyCanvas.toDataURL
      .mockReturnValue(base64);
    spyPica.resize
      .mockReturnValue(spyCanvas);
    spyPica.toBlob
      .mockReturnValue('');

    Object.defineProperty(Image.prototype, 'onload', {
      set: (cb) => setTimeout(cb),
    });

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
            picaProvider: {
              provide: PICA,
              useValue: spyPica,
            },
          }),
        ],
        providers: [
          { provide: PLATFORM_DOCUMENT, useValue: spyDocument }],
      })
      .get(PicaService);
  });

  describe('When I resize base64', () => {
    it('Should resize string', async () => {
      const resized = await service.resizeImage({ data: base64, height: 1, width: 1 });
      expect(resized).toBe(base64);
    });
  });

  describe('When I resize upload', () => {
    it('Should resize file', async () => {
      const resized = await service.resizeImage({ data: image, height: 1, width: 1 });
      // Cannot match image because of lastModified
      expect(resized).toBeInstanceOf(File);
    });
  });
});
