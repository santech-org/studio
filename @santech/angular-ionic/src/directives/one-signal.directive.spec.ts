import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed  } from '@angular/core/testing';
import {
  OneSignal,
  OSActionType,
  OSDisplayType,
  OSNotification,
  OSNotificationOpenedResult,
} from '@ionic-native/onesignal/ngx';
import { Platform } from '@ionic/angular';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Subject } from 'rxjs';
import { cordovaPlatform, ISubscriptionChange, ONE_SIGNAL_CONFIG, OneSignalService, SantechIonicModule } from '..';
import { spyOneSignal, spyPlatform } from '../../testing/ionic';

const appId = 'appId';
const googleProjectNumber = 'googleProjectNumber';

@Component({
  selector: 'one-signal',
  template: `
    <div one-signal>
    </div>
  `,
})
class OneSignalTestComponent {}

describe('One Signal directive', () => {
  let fixture: ComponentFixture<OneSignalTestComponent>;

  const handleNotificationReceived = new Subject<OSNotification>();
  const handleNotificationOpened = new Subject<OSNotificationOpenedResult>();
  const addSubscriptionObserver = new Subject<ISubscriptionChange>();

  const initError = jest.fn();
  const notificationOpened = jest.fn();
  const notificationReceived = jest.fn();
  const subscriptionChanged = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    spyOneSignal.handleNotificationReceived.mockReturnValue(handleNotificationReceived);
    spyOneSignal.handleNotificationOpened.mockReturnValue(handleNotificationOpened);
    spyOneSignal.addSubscriptionObserver.mockReturnValue(addSubscriptionObserver);

    TestBed
      .configureTestingModule({
        declarations: [
          OneSignalTestComponent,
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

    oneSignalService.onInitError.subscribe((event: Error) => initError(event));
    oneSignalService.onNotificationOpened.subscribe((event: OSNotificationOpenedResult) => notificationOpened(event));
    oneSignalService.onNotificationReceived.subscribe((event: OSNotification) => notificationReceived(event));
    oneSignalService.onSubscriptionChanged.subscribe((event: ISubscriptionChange) => subscriptionChanged(event));
  });

  describe('On mobile', () => {
    describe('When one signal init fails', () => {
      const error = new Error();

      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
        spyOneSignal.startInit.mockImplementation(() => { throw error; });
        fixture = TestBed.createComponent(OneSignalTestComponent);
        fixture.autoDetectChanges();
      }));

      afterEach(() => fixture.destroy());

      it('Should emit init error', () => {
        expect(initError).toHaveBeenCalledTimes(1);
        expect(initError).toHaveBeenCalledWith(error);
      });
    });

    describe('When user requires to initialize one signal', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
        fixture = TestBed.createComponent(OneSignalTestComponent);
        fixture.autoDetectChanges();
      }));

      afterEach(() => fixture.destroy());

      it('Should call OneSignal init', () => {
        expect(spyOneSignal.startInit).toHaveBeenCalledTimes(1);
        expect(spyOneSignal.endInit).toHaveBeenCalledTimes(1);
      });

      describe('And notification received', () => {
        const event: OSNotification  = {
          contents: {},
          displayType: OSDisplayType.InAppAlert,
          isAppInFocus: false,
          payload: {
            actionButtons: [],
            body: 'body message',
            notificationID: 'id',
            rawPayload: '',
            sound: 'sound',
            title: 'title',
          },
          shown: true,
        };
        beforeEach(() => handleNotificationReceived.next(event));

        it('Should emit on notificationReceived output', () => {
          expect(notificationReceived).toHaveBeenCalledTimes(1);
          expect(notificationReceived).toHaveBeenCalledWith(event);
        });
      });

      describe('And notification opened', () => {
        const event: OSNotificationOpenedResult  = {
          action: {
            type: OSActionType.ActionTake,
          },
          notification: {
            contents: {},
            displayType: OSDisplayType.InAppAlert,
            isAppInFocus: false,
            payload: {
              actionButtons: [],
              body: 'body message',
              notificationID: 'id',
              rawPayload: '',
              sound: 'sound',
              title: 'title',
            },
            shown: true,
          },
        };
        beforeEach(() => handleNotificationOpened.next(event));

        it('Should emit on notificationOpened output', () => {
          expect(notificationOpened).toHaveBeenCalledTimes(1);
          expect(notificationOpened).toHaveBeenCalledWith(event);
        });
      });

      describe('And subscription state changed', () => {
        const event: ISubscriptionChange  = {
          from: {
            pushToken: '',
            subscribed: false,
            userId: '',
            userSubscriptionSetting: {},
          },
          to: {
            pushToken: '',
            subscribed: false,
            userId: '',
            userSubscriptionSetting: {},
          },
        };
        beforeEach(() => addSubscriptionObserver.next(event));

        it('Should emit on subscriptionChanged output', () => {
          expect(subscriptionChanged).toHaveBeenCalledTimes(1);
          expect(subscriptionChanged).toHaveBeenCalledWith(event);
        });
      });
    });
  });

  describe('On desktop', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue('desktop');
      fixture = TestBed.createComponent(OneSignalTestComponent);
      fixture.autoDetectChanges();
    }));

    afterEach(() => fixture.destroy());

    it('Should not initialize One Signal', () => {
      expect(spyOneSignal.startInit).not.toHaveBeenCalled();
    });
  });
});
