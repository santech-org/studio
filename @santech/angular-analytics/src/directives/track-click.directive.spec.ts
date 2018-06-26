// tslint:disable:max-classes-per-file
import { Component, Injectable } from '@angular/core';
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { spyAnalytics } from '@santech/analytics-core/testing';
import { APP_INFORMATION, CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
// tslint:disable-next-line:no-implicit-dependencies
import { SantechPlatformModule } from '@santech/angular-platform';
import { Http } from '@santech/core';
import { spyHttp } from '@santech/core/testing';
import { ANALYTICS, ANALYTICS_RESOLVERS, IAnalyticsResolver, IAnalyticsService, SantechAnalyticsModule } from '..';

const endPoint = 'http://host:port';
const wsEndPoint = 'ws://host:port';
const info = {
  name: 'Application',
  version: 'Version',
};
const event = 'send-message';

@Injectable()
class UserIdAnalyticsService implements IAnalyticsService<{ userId: string }, { userId: string } | undefined> {
  public resolveAnalyticsKey(context?: { userId: string }) {
    return Promise.resolve({ userId: 'userId', ...context });
  }
}

@Injectable()
class RolesAnalyticsService implements IAnalyticsService<{ isProfessional: boolean}, undefined> {
  public resolveAnalyticsKey() {
    return Promise.resolve({ isProfessional: false });
  }
}

interface IUserResolve {
  userId: string;
}

function userIdResolverFactory(service: UserIdAnalyticsService): IAnalyticsResolver<IUserResolve, IUserResolve> {
  return {
    key: 'userId',
    service,
  };
}

interface IRolesResolve {
  isProfessional: boolean;
}
function rolesResolverFactory(service: RolesAnalyticsService): IAnalyticsResolver<IRolesResolve, undefined> {
  return {
    key: 'roles',
    service,
  };
}

@Component({
  selector: 'test-track-click',
  template: `<button track-click [event]="event" [keys]="keys" [context]="context"></button>`,
})
class TrackClickTestComponent {
  public event = event;
  public keys = ['userId', 'roles'];
  public context: any;
}

describe('Track click directive', () => {
  let fixture: ComponentFixture<TrackClickTestComponent>;

  beforeEach(async () => {
    jest.resetAllMocks();

    fixture = TestBed
      .configureTestingModule({
        declarations: [
          TrackClickTestComponent,
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
          UserIdAnalyticsService,
          RolesAnalyticsService,
          { provide: Http, useValue: spyHttp },
          { provide: ANALYTICS, useValue: spyAnalytics },
          {
            deps: [UserIdAnalyticsService],
            multi: true,
            provide: ANALYTICS_RESOLVERS,
            useFactory: userIdResolverFactory,
          },
          {
            deps: [RolesAnalyticsService],
            multi: true,
            provide: ANALYTICS_RESOLVERS,
            useFactory: rolesResolverFactory,
          },
        ],
      })
      .createComponent(TrackClickTestComponent);

    fixture.autoDetectChanges();
  });

  afterEach(() => fixture.destroy());

  describe('When user clicks on directive parent element', () => {
    beforeEach(() => fixture.nativeElement.querySelector('button').click());

    it('Should track event', () => {
      expect(spyAnalytics.track).toHaveBeenCalledTimes(1);
      expect(spyAnalytics.track).toHaveBeenCalledWith(event, {
        isProfessional: false,
        name: 'Application',
        userId: 'userId',
        version: 'Version',
      }, null);
    });
  });

  describe('When I provide a context', () => {
    const context = {
      userId: 'newUserId',
    };

    beforeEach(() => {
      fixture.componentInstance.context = context;
      fixture.detectChanges();
      fixture.nativeElement.querySelector('button').click();
    });

    it('Should have called resolvers with context', () => {
      expect(spyAnalytics.track).toHaveBeenCalledTimes(1);
      expect(spyAnalytics.track).toHaveBeenCalledWith(event, {
        isProfessional: false,
        name: 'Application',
        userId: 'newUserId',
        version: 'Version',
      }, null);
    });
  });
});
