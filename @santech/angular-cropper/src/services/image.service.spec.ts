import { async, TestBed } from '@angular/core/testing';
import { CropperSettings } from 'ngx-img-cropper';
import { SantechCropperModule } from '../index';
import { CROPPER_SETTINGS_FACTORY } from '../tokens/cropper-settings-factory';
import { ImageService } from './image.service';

describe('Images service', () => {
  let service: ImageService;

  beforeEach(async(() => {
    service = TestBed.configureTestingModule({
      imports: [
        SantechCropperModule.forRoot({
          provide: CROPPER_SETTINGS_FACTORY,
          useValue: () => new CropperSettings(),
        }),
      ],
    }).get(ImageService);
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
