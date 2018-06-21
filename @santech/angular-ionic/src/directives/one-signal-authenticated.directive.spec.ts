import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed  } from '@angular/core/testing';
import { OneSignal } from '@ionic-native/onesignal';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Platform } from 'ionic-angular';
import { cordovaPlatform, IOneSignalIds, ONE_SIGNAL_CONFIG, OneSignalService, SantechIonicModule } from '..';
import { spyOneSignal, spyPlatform } from '../../testing/ionic';

const googleProjectNumber = 'googleProjectNumber';
const appId = 'appId';
const error = new Error();

@Component({
  selector: 'one-signal-auth',
  template: `
    <div one-signal-auth>
    </div>
  `,
})
class OneSignalAuthenticatedTestComponent {}

describe('One Signal Authenticated directive', () => {
  let fixture: ComponentFixture<OneSignalAuthenticatedTestComponent>;
  const notificationsEnabled = jest.fn();
  const enableError = jest.fn();
  const disableError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    TestBed
      .configureTestingModule({
        declarations: [
          OneSignalAuthenticatedTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
        providers: [
          { provide: Platform, useValue: spyPlatform},
          { provide: OneSignal, useValue: spyOneSignal},
          {
            provide: ONE_SIGNAL_CONFIG,
            useFactory: () => ({
              appId,
              googleProjectNumber,
            }),
          },
        ],
      });

    const oneSignalService: OneSignalService = TestBed.get(OneSignalService);
    oneSignalService.onNotificationsEnabled.subscribe((event: IOneSignalIds) => notificationsEnabled(event));
    oneSignalService.onEnableError.subscribe((event: Error) => enableError(event));
    oneSignalService.onDisableError.subscribe((event: Error) => disableError(event));
  });

  describe('On mobile', () => {
    const ids = {
      pushToken: 'token',
      userId: 'userId',
    };

    describe('When user reaches authenticated section', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
        spyOneSignal.getIds.mockResolvedValue(ids);

        fixture = TestBed.createComponent(OneSignalAuthenticatedTestComponent);
        fixture.autoDetectChanges();
      }));

      afterEach(() => fixture.destroy());

      it('Should emit authenticated with identifiers', () => {
        expect(spyOneSignal.getIds).toHaveBeenCalledTimes(1);
        expect(spyOneSignal.setSubscription).toHaveBeenCalledTimes(1);
        expect(spyOneSignal.setSubscription).toHaveBeenCalledWith(true);
        expect(notificationsEnabled).toHaveBeenCalledTimes(1);
        expect(notificationsEnabled).toHaveBeenCalledWith(ids);
      });
    });

    describe('When user leaves authenticated section', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
        spyOneSignal.getIds.mockResolvedValue(ids);

        fixture = TestBed.createComponent(OneSignalAuthenticatedTestComponent);
        fixture.autoDetectChanges();
      }));

      describe('And successfully unsubscribe from notifications', () => {
        beforeEach(async(() => {
          fixture.destroy();
        }));

        it('Should emit destroy with identifiers', () => {
          expect(spyOneSignal.setSubscription).toHaveBeenCalledTimes(2);
          expect(spyOneSignal.setSubscription).toHaveBeenCalledWith(false);
        });
      });

      describe('And fail to unsubscribe from notifications', () => {
        beforeEach(async(() => {
          spyOneSignal.setSubscription.mockImplementation(() => { throw error; });
          fixture.destroy();
        }));

        it('Should emit disable error', () => {
          expect(disableError).toHaveBeenCalledTimes(1);
          expect(disableError).toHaveBeenCalledWith(error);
        });
      });
    });

    describe('When not able to subscribe to notifications', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
        spyOneSignal.getIds.mockResolvedValue(ids);
        spyOneSignal.setSubscription.mockImplementation(() => { throw error; });

        fixture = TestBed.createComponent(OneSignalAuthenticatedTestComponent);
        fixture.autoDetectChanges();
      }));

      afterEach(() => fixture.destroy());

      it('Should emit enable error', () => {
        expect(enableError).toHaveBeenCalledTimes(1);
        expect(enableError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('On desktop', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue('desktop');
      fixture = TestBed.createComponent(OneSignalAuthenticatedTestComponent);
      fixture.autoDetectChanges();
    }));

    afterEach(() => fixture.destroy());

    it('Should not initialize One Signal', () => {
      expect(notificationsEnabled).not.toHaveBeenCalled();
    });
  });
});
