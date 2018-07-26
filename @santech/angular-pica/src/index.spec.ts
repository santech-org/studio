import { inject, TestBed } from '@angular/core/testing';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import * as exifJs from 'exif-js';
import * as Pica from 'pica';
import { PICA, SantechPicaModule } from '.';
import { PicaService } from './services/pica.service';
import { EXIF } from './tokens/exif.token';

describe('SantechPicaModule', () => {
  describe('When imported for Root', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot(),
        SantechPicaModule.forRoot(),
      ],
    }));

    it('Should provide pica instance', inject([PICA], (pica: typeof Pica) => {
      expect(pica).toBeInstanceOf(Pica);
    }));

    it('Should provide the exif-js function', inject([EXIF], (exif: typeof exifJs) => {
      expect(exif).toBe(exifJs);
    }));
  });

  describe('When client provides exifjs and pica for Root', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot(),
        SantechPicaModule.forRoot({
          exifProvider: {
            provide: EXIF,
            useValue: exifJs,
          },
          picaProvider: {
            provide: PICA,
            useValue: new Pica(),
          },
        }),
      ],
    }));

    it('Should provide pica instance', inject([PICA], (pica: typeof Pica) => {
      expect(pica).toBeInstanceOf(Pica);
    }));

    it('Should provide the exif-js function', inject([EXIF], (exif: typeof exifJs) => {
      expect(exif).toBe(exifJs);
    }));
  });

  describe('When imported for Child', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot(),
        SantechPicaModule.forChild(),
      ],
    }));

    it('Should not provide anything', () => {
      expect(() => TestBed.get(PicaService)).toThrow();
    });
  });
});
