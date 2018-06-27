import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { spyAnalytics } from '@santech/analytics-core/testing';
import { APP_INFORMATION, CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Subject } from 'rxjs';
import { ANALYTICS, SantechAnalyticsModule } from '..';

const endPoint = 'http://host:port';
const wsEndPoint = 'ws://host:port';
const info = {
  name: 'Application',
  version: 'Version',
};

const router = {
  events: new Subject<NavigationStart | NavigationEnd>(),
  routerState: { snapshot: {} },
};

@Component({
  selector: 'test-routing-analytics',
  template: `<div routing-analytics (onAnalyticsError)="error($event)"></div>`,
})
class RoutingAnalyticsTestComponent {
  public error = jest.fn();
}

describe('RoutingAnalyticsDirective', () => {
  let fixture: ComponentFixture<RoutingAnalyticsTestComponent>;
  let snapshot: any;

  beforeEach(async(() => {
    jest.resetAllMocks();

    fixture = TestBed
      .configureTestingModule({
        declarations: [
          RoutingAnalyticsTestComponent,
        ],
        imports: [
          SantechPlatformModule.forRoot(),
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
          { provide: ANALYTICS, useValue: spyAnalytics },
          { provide: Router, useValue: router },
        ],
      })
      .createComponent(RoutingAnalyticsTestComponent);

    snapshot = TestBed.get(Router).routerState.snapshot;

    fixture.autoDetectChanges();
  }));

  afterEach(() => fixture.destroy());

  describe('When user navigates', () => {
    describe('And before NavigationEnd', () => {
      beforeEach(() => router.events.next(new NavigationStart(0, '')));

      it('Should not trigger analytics', () => {
        expect(spyAnalytics.page).not.toHaveBeenCalled();
      });
    });

    describe('And at navigationEnd', () => {
      describe('And on main page', () => {
        beforeEach(() => {
          snapshot.url = '/main';
          snapshot.root = {
            children: [{
              children: [],
            }],
          };

          router.events.next(new NavigationEnd(0, '', '/main'));
        });

        it('Should trigger analytics', () => {
          expect(spyAnalytics.page).toHaveBeenCalledWith(`${info.name}-main`, 'Main', {
            attributes: {},
            name: 'Main',
            path: '',
          });
        });
      });

      describe('And on detail page', () => {
        beforeEach(() => {
          snapshot.url = '/main/id';
          snapshot.root = {
            children: [{
              children: [{
                params: {
                  id: 'id',
                },
              }],
            }],
          };

          router.events.next(new NavigationEnd(0, '/main', '/main/id'));
        });

        it('Should trigger analytics', () => {
          expect(spyAnalytics.page).toHaveBeenCalledWith(`${info.name}-main`, 'Detail', {
            attributes: {
              id: 'id',
            },
            name: 'Detail',
            path: '',
          });
        });
      });

      describe('And on sub page', () => {
        beforeEach(() => {
          snapshot.url = '/main/sub';
          snapshot.root = {
            children: [{
              children: [],
            }],
          };

          router.events.next(new NavigationEnd(0, '/main', '/main/sub'));
        });

        it('Should trigger analytics', () => {
          expect(spyAnalytics.page).toHaveBeenCalledWith(`${info.name}-main`, 'sub', {
            attributes: {},
            name: 'sub',
            path: 'sub',
          });
        });
      });

      describe('And on sub detail page', () => {
        beforeEach(() => {
          snapshot.url = '/main/sub/id';
          snapshot.root = {
            children: [{
              children: [{
                params: {
                  id: 'id',
                },
              }],
            }],
          };

          router.events.next(new NavigationEnd(0, '/main', '/main/sub'));
        });

        it('Should trigger analytics', () => {
          expect(spyAnalytics.page).toHaveBeenCalledWith(`${info.name}-main`, 'Detail', {
            attributes: {
              id: 'id',
            },
            name: 'Detail',
            path: 'sub',
          });
        });
      });

      describe('And send analytics fails', () => {
        const error = new Error();

        beforeEach(() => {
          spyAnalytics.page.mockImplementation(() => {
            throw error;
          });

          snapshot.url = '/main';
          snapshot.root = {
            children: [{
              children: [],
            }],
          };

          router.events.next(new NavigationEnd(0, '', '/main'));
        });

        it('Should emit error', () => {
          expect(fixture.componentInstance.error).toHaveBeenCalledWith(error);
        });
      });
    });
  });
});
