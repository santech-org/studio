import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Camera,
  CameraOptions,
  DestinationType,
  EncodingType,
  MediaType,
  PictureSourceType,
} from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { FileService, SantechCommonModule } from '@santech/angular-common';
import { spyFileService } from '@santech/angular-common/testing';
import { ResizeService, SantechCropperModule } from '@santech/angular-cropper';
import { spyResizeService } from '@santech/angular-cropper/testing';
import { PLATFORM_DOCUMENT, SantechPlatformModule } from '@santech/angular-platform';
import { createJestSpyObj } from '@santech/core/testing';
import { CameraDirective, cordovaPlatform, ICameraOptions, SantechIonicModule } from '..';
import { spyCamera, spyFile, spyPlatform } from '../../testing/ionic';

const galleryUrl = 'file:///storage/emulated/0/Android/data/com.ionicframework.amemobile282255/cache/1500394666871.png';

const cameraUrl = 'file:///storage/emulated/0/Android/data/com.ionicframework.amemobile282255/cache/54415641.png?15366';

const base64 = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

@Component({
  selector: 'test-camera',
  template: `
    <div
      camera
      [options]="options"
      (pictureStart)="treatStart()"
      (pictureCancel)="treatCancel()"
      (pictureProcess)="treatProcess()"
      (pictureSuccess)="treatPicture($event)"
      (pictureError)="treatError($event)"
    >
    </div>
  `,
})
class CameraTestComponent {
  @ViewChild(CameraDirective)
  // @ts-ignore
  public camera: CameraDirective;
  public options: ICameraOptions = {};
  public treatStart = jest.fn();
  public treatCancel = jest.fn();
  public treatProcess = jest.fn();
  public treatPicture = jest.fn();
  public treatError = jest.fn();
}

describe('Camera directive', () => {
  const spyDocument = createJestSpyObj<Document>(['createElement']);
  const spyInput = createJestSpyObj<HTMLInputElement & {
    selectFile: (event: any) => void,
  }>(['addEventListener', 'removeEventListener', 'click']);
  let fixture: ComponentFixture<CameraTestComponent>;

  beforeEach(async(() => {
    jest.resetAllMocks();

    spyResizeService.resizeImage.mockResolvedValue(base64);

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

    spyFile.readAsDataURL.mockImplementation((path: string, fileName: string) => {
      switch (true) {
        case galleryUrl.startsWith(path.concat(fileName)):
          return Promise.resolve(base64);
        case cameraUrl.startsWith(path.concat(fileName)):
          return Promise.resolve(base64);
        default:
          throw new Error(`Unknown path ${path.concat(fileName)}`);
      }
    });

    spyDocument.createElement.mockReturnValue(spyInput);
    spyInput.addEventListener.mockImplementation((event: string, cb: any) => {
      if (event !== 'change') {
        throw new Error(`Unknown listener ${event}`);
      }
      spyInput.selectFile = cb;
    });

    spyFileService.readImageFile.mockResolvedValue(base64);

    TestBed
      .configureTestingModule({
        declarations: [
          CameraTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechCropperModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
        providers: [
          { provide: Platform, useValue: spyPlatform },
          { provide: Camera, useValue: spyCamera },
          { provide: File, useValue: spyFile },
          { provide: FileService, useValue: spyFileService },
          { provide: ResizeService, useValue: spyResizeService },
          { provide: PLATFORM_DOCUMENT, useValue: spyDocument },
        ],
      });

    fixture = TestBed.createComponent(CameraTestComponent);
    fixture.detectChanges();
  }));

  describe('On mobile', () => {
    beforeEach(() => spyPlatform.ready.mockResolvedValue(cordovaPlatform));

    describe('When user clicks on element', () => {
      beforeEach(() => {
        fixture.componentInstance.camera.onClick();
        // HostListener triggers change detection so all promises are resolved
        expect(fixture.componentInstance.treatProcess).not.toHaveBeenCalled();
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

      fit('Should wait for user selection', () => {
        expect(fixture.componentInstance.treatStart).toHaveBeenCalled();
        // See above comment
        // expect(fixture.componentInstance.treatProcess).not.toHaveBeenCalled();
      });

      describe('And user select a picture', () => {
        // this is useless
        // beforeEach(async(() => fixture.detectChanges()));

        it('Should emit picture', () => {
          expect(fixture.componentInstance.treatProcess).toHaveBeenCalled();
          expect(fixture.componentInstance.treatPicture).toHaveBeenCalledWith({
            base64: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
            name: '1500394666871.png',
          });
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

      it('Should emit picture', () => {
        expect(fixture.componentInstance.treatPicture).toHaveBeenCalledWith({
          base64: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
          name: '54415641.png',
        });
      });
    });

    describe('When user cancels the picture', () => {
      beforeEach(async(() => {
        spyCamera.getPicture.mockRejectedValue('No Image Selected');
        return fixture.componentInstance.camera.onClick();
      }));

      it('Should cancel the selection', () => {
        expect(fixture.componentInstance.treatCancel).toHaveBeenCalled();
      });
    });

    describe('When plugin throws', () => {
      beforeEach(async(() => {
        spyCamera.getPicture.mockRejectedValue('selection did not complete!');
        return fixture.componentInstance.camera.onClick();
      }));

      it('Should emit the error', () => {
        expect(fixture.componentInstance.treatError).toHaveBeenCalledWith(new Error('selection did not complete!'));
      });
    });

    describe('When plugin throws unexpectedly', () => {
      beforeEach(async(() => {
        spyCamera.getPicture.mockRejectedValue(new Error('LOL'));
        return fixture.componentInstance.camera.onClick();
      }));

      it('Should emit the error', () => {
        expect(fixture.componentInstance.treatError).toHaveBeenCalledWith(new Error('LOL'));
      });
    });
  });

  describe('On desktop', () => {
    beforeEach(async(() => spyPlatform.ready.mockResolvedValue('desktop')));

    describe('When user clicks on element', () => {
      beforeEach(async(() => fixture.componentInstance.camera.onClick()));

      it('Should wait for user selection', () => {
        expect(fixture.componentInstance.treatStart).toHaveBeenCalled();
        expect(fixture.componentInstance.treatProcess).not.toHaveBeenCalled();
      });

      describe('And cancel its selection', () => {
        beforeEach(async(() => spyInput.selectFile({
          target: { files: [] },
        })));

        it('Should cancel selection', () => {
          expect(fixture.componentInstance.treatCancel).toHaveBeenCalled();
        });
      });

      describe('And select a file', () => {
        beforeEach(async(() => spyInput.selectFile({
          target: { files: [{ name: 'name' }] },
        })));

        it('Should emit the picture', () => {
          expect(fixture.componentInstance.treatProcess).toHaveBeenCalled();
          expect(fixture.componentInstance.treatPicture).toHaveBeenCalledWith({
            base64: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
            name: 'name',
          });
        });
      });
    });
  });
});
