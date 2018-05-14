import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Platform } from 'ionic-angular';
import { cordovaPlatform, HideSplashScreenDirective, SantechIonicModule } from '..';
import { spyPlatform, spySplashScreen } from '../../testing/ionic';

@Component({
  selector: 'test-hide-splash-screen',
  template: `<div hide-splash-screen></div>`,
})
class HideSplashScreenTestComponent { }

describe('Hide splash screen directive', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    TestBed
      .configureTestingModule({
        declarations: [
          HideSplashScreenTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
        providers: [
          { provide: Platform, useValue: spyPlatform },
        ],
      })
      .overrideDirective(HideSplashScreenDirective, {
        set: {
          providers: [
            { provide: SplashScreen, useValue: spySplashScreen },
          ],
        },
      });
  });

  describe('On mobile', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue(cordovaPlatform);
      TestBed.createComponent(HideSplashScreenTestComponent).autoDetectChanges();
    }));

    it('Should hide splashscreen when platform\'s ready', () => {
      expect(spySplashScreen.hide).toHaveBeenCalled();
    });
  });

  describe('On desktop', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue('desktop');
      TestBed.createComponent(HideSplashScreenTestComponent).autoDetectChanges();
    }));

    it('Should not hide splashscreen when platform\'s ready', () => {
      expect(spySplashScreen.hide).not.toHaveBeenCalled();
    });
  });
});
