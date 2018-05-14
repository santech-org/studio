import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Camera,
  CameraOptions,
  DestinationType,
  EncodingType,
  MediaType,
  PictureSourceType,
} from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Platform } from 'ionic-angular';
import { CameraDirective, cordovaPlatform, ICameraOptions, SantechIonicModule } from '..';
import { spyCamera, spyPlatform } from '../../testing/ionic';

const galleryUrl = 'file:///storage/emulated/0/Android/data/com.ionicframework.amemobile282255/cache/1500394666871.png';
const galleryBase64 = 'data:image/jpeg;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

const cameraUrl = 'file:///storage/emulated/0/Android/data/com.ionicframework.amemobile282255/cache/54415641.png?15366';
const cameraBase64 = 'data:image/jpeg;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

@Component({
  selector: 'test-camera',
  template: `
    <div camera (pictureSuccess)="treatPicture($event)"
                (pictureError)="treatError($event)"
                [options]="options">
    </div>`,
})
class CameraTestComponent {
  @ViewChild(CameraDirective)
  // @ts-ignore
  public camera: CameraDirective;
  public options: ICameraOptions = {};
  public treatPicture = jest.fn();
  public treatError = jest.fn();
}

describe('Camera directive', () => {
  let fixture: ComponentFixture<CameraTestComponent>;

  beforeEach(() => {
    jest.resetAllMocks();

    spyCamera.getPicture.mockImplementation((config: CameraOptions) => {
      switch (config.sourceType) {
        case 0:
          return Promise.resolve(galleryUrl);
        case 1:
          return Promise.resolve(cameraUrl);
        default:
          throw new Error(`Unknown sourceType ${config.sourceType}`);
      }
    });

    const file = new File();
    jest.spyOn(file, 'readAsDataURL').mockImplementation((path: string, fileName: string) => {
      switch (true) {
        case galleryUrl.startsWith(path.concat(fileName)):
          return Promise.resolve(galleryBase64);
        case cameraUrl.startsWith(path.concat(fileName)):
          return Promise.resolve(cameraBase64);
        default:
          throw new Error(`Unknown path ${path.concat(fileName)}`);
      }
    });

    TestBed
      .configureTestingModule({
        declarations: [
          CameraTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
        providers: [
          { provide: Platform, useValue: spyPlatform },
          { provide: Camera, useValue: spyCamera },
          { provide: File, useValue: file },
        ],
      });

    fixture = TestBed.createComponent(CameraTestComponent);
    fixture.autoDetectChanges();
  });

  describe('On mobile', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue(cordovaPlatform);
    }));

    describe('When user clicks on element', () => {
      beforeEach(async(() => fixture.componentInstance.camera.onClick()));

      it('Should take a picture of the gallery', () => {
        expect(fixture.componentInstance.treatPicture).toHaveBeenCalledWith({
          base64: galleryBase64,
          name: '1500394666871.png',
        });
      });

      it('Should use the default options', () => {
        expect(spyCamera.getPicture).toHaveBeenCalledWith({
          allowEdit: true,
          correctOrientation: true,
          destinationType: DestinationType.FILE_URL,
          encodingType: EncodingType.JPEG,
          mediaType: MediaType.PICTURE,
          quality: 80,
          saveToPhotoAlbum: false,
          sourceType: PictureSourceType.PHOTOLIBRARY,
        });
      });
    });

    describe('When options is defined', () => {
      beforeEach(async(() => {
        fixture.componentInstance.options = {
          sourceType: PictureSourceType.CAMERA,
        };
        fixture.autoDetectChanges();
        return fixture.componentInstance.camera.onClick();
      }));

      it('Should use the default options updated with current ones', () => {
        expect(spyCamera.getPicture).toHaveBeenCalledWith({
          allowEdit: true,
          correctOrientation: true,
          destinationType: DestinationType.FILE_URL,
          encodingType: EncodingType.JPEG,
          mediaType: MediaType.PICTURE,
          quality: 80,
          saveToPhotoAlbum: false,
          sourceType: PictureSourceType.CAMERA,
        });
      });
    });
  });

  describe('On desktop', () => {
    let inputClick: jest.SpyInstance;

    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue('desktop');

      inputClick = jest.spyOn(fixture.componentInstance.camera.input, 'click');
    }));

    describe('When user clicks on element', () => {
      beforeEach(async(() => fixture.componentInstance.camera.onClick()));

      it('Should display a file input', () => {
        expect(inputClick).toHaveBeenCalled();
      });
    });
  });
});
