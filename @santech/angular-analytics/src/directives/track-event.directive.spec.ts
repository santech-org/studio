import { Component } from '@angular/core';
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { spyAnalytics } from '@santech/analytics-core/testing';
import { APP_INFORMATION, CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
// tslint:disable-next-line:no-implicit-dependencies
import { SantechPlatformModule } from '@santech/angular-platform';
import { Http } from '@santech/core';
import { spyHttp } from '@santech/core/testing';
import { Subject, Subscription } from 'rxjs';
import { ANALYTICS, SantechAnalyticsModule } from '..';
import { ITrackEvent } from '../../dist';

const endPoint = 'http://host:port';
const wsEndPoint = 'ws://host:port';
const info = {
  name: 'Application',
  version: 'Version',
};

@Component({
  selector: 'test-track-event',
  template: `<div track-event [event]="event"></div>`,
})
class TrackEventTestComponent {
  public event = new Subject<ITrackEvent>();
}

describe('Track event directive', () => {
  let fixture: ComponentFixture<TrackEventTestComponent>;
  let subscribeSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.resetAllMocks();

    fixture = TestBed
      .configureTestingModule({
        declarations: [
          TrackEventTestComponent,
        ],
        imports: [
        SantechPlatformModule.forRoot(),
        SantechAnalyticsModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot({
            appInformationProvider: {
              provide: APP_INFORMATION,
              useValue: info,
            },
            endPointsProvider: {
              provide: CONFIG_END_POINTS,
              useValue: { endPoint, wsEndPoint },
            },
          }),
        ],
        providers: [
          { provide: Http, useValue: spyHttp },
          { provide: ANALYTICS, useValue: spyAnalytics },
        ],
      })
      .createComponent(TrackEventTestComponent);

    subscribeSpy = jest.spyOn(fixture.componentInstance.event, 'subscribe');
  });

  describe('When user navigates to a page with track-event directive', () => {
    beforeEach(() => fixture.autoDetectChanges());
    afterEach(() => fixture.destroy());

    it('Should subscribe to event', () => {
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });

    describe('When user generates event', () => {
      const event = 'send-message';
      const track = {event};

      beforeEach(() => fixture.componentInstance.event.next(track));

      it('Should call analytics and track event', () => {
        expect(spyAnalytics.track).toHaveBeenCalledTimes(1);
        expect(spyAnalytics.track).toHaveBeenCalledWith(event, info, undefined);
      });
    });
  });

  describe('When user leaves a page with track-event directive', () => {
    const eventSubscription = new Subscription();
    let unsubscribeSpy: jest.SpyInstance;

    beforeEach(async () => {
      subscribeSpy.mockReturnValue(eventSubscription);
      unsubscribeSpy = jest.spyOn(eventSubscription, 'unsubscribe');

      await fixture.autoDetectChanges();
      await fixture.destroy();
    });

    it('Should unsubscribe to event', () => {
      expect(subscribeSpy).toHaveBeenCalledTimes(1);
      expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
