import { async, TestBed } from '@angular/core/testing';
import { FileService } from '@santech/angular-common';
import { spyFileService } from '@santech/angular-common/testing';
import { PicaService } from '@santech/angular-pica';
import { spyPicaService } from '@santech/angular-pica/testing';
import { SantechCropperModule } from '..';
import { ResizeService } from './resize.service';

describe('Resize service', () => {
  let service: ResizeService;

  beforeEach(async(() => {
    service = TestBed.configureTestingModule({
      imports: [
        SantechCropperModule.forRoot(),
      ],
      providers: [
        {
          provide: FileService,
          use: spyFileService,
        },
        {
          provide: PicaService,
          use: spyPicaService,
        },
      ],
    }).get(ResizeService);
  }));

  describe('When I test if file has wrong extensions', () => {
    describe('And I provide a valid .png file', () => {
      it('Should return false', async(() => {
        const file: any = { name: 'myPicture.png' };
        expect(service.hasWrongExtension(file)).toEqual(false);
      }));
    });

    describe('And I provide a valid .jpeg file', () => {
      it('Should return false', async(() => {
        const file: any = { name: 'myPicture.jpeg' };
        expect(service.hasWrongExtension(file)).toEqual(false);
      }));
    });

    describe('And I provide a valid .gif file', () => {
      it('Should return false', async(() => {
        const file: any = { name: 'myPicture.gif' };
        expect(service.hasWrongExtension(file)).toEqual(false);
      }));
    });

    describe('And I provide an invalid .doc file', () => {
      it('Should return true', async(() => {
        const file: any = { name: 'myDoc.doc' };
        expect(service.hasWrongExtension(file)).toEqual(true);
      }));
    });
  });
});
