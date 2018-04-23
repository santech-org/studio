import { TestBed } from '@angular/core/testing';
import { IAnalyticsJS } from '@santech/analytics-core';
import { CONFIG_END_POINTS, SantechCommonModule } from '@santech/angular-common';
// tslint:disable-next-line:no-implicit-dependencies
import { SantechPlatformModule } from '@santech/angular-platform';
import { Http } from '@santech/core';
import { spyHttp } from '@santech/core/testing';
import { ANALYTICS, SantechAnalyticsModule } from '.';

const endPoint = 'http://host:port';
const wsEndPoint = 'ws://host:port';

describe('SantechAnalyticsModule', () => {
  let analytics: IAnalyticsJS;

  beforeEach(() => {
    analytics = TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot({
          endPointsProvider: {
            provide: CONFIG_END_POINTS,
            useValue: { endPoint, wsEndPoint },
          },
        }),
        SantechAnalyticsModule.forRoot(),
      ],
      providers: [{
        provide: Http,
        useValue: spyHttp,
      }],
    }).get(ANALYTICS);
  });

  it('Should set up all for analytics', () => {
    analytics.page();
    expect(spyHttp.post).toHaveBeenCalled();
  });
});
