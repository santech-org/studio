import { ModuleWithProviders, NgModule } from '@angular/core';
import { analytics, IAnalyticsJS } from '@santech/analytics-core';
import { SantechIntegration } from '@santech/analytics-integration';
import { END_POINTS, SantechCommonModule } from '@santech/angular-common';
import { Http } from '@santech/core';
import { TrackEventDirective } from './directives/track-event.directive';
import { ISantechAnalyticsModuleConfiguration } from './interfaces/configuration';
import { ANALYTICS_OPTIONS } from './tokens/analytics-options.token';
import { ANALYTICS } from './tokens/analytics.token';

export * from './directives/track-event.directive';
export * from './interfaces/configuration';
export * from './interfaces/track-event';
export * from './tokens/analytics-options.token';
export * from './tokens/analytics.token';

export function analyticsFactory(): IAnalyticsJS {
  return analytics;
}

@NgModule({
  declarations: [
    TrackEventDirective,
  ],
  exports: [
    TrackEventDirective,
  ],
  imports: [
    SantechCommonModule.forChild(),
  ],
})
export class SantechAnalyticsModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechAnalyticsModule,
    };
  }

  public static forRoot(config: ISantechAnalyticsModuleConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: SantechAnalyticsModule,
      providers: [
        {
          deps: [Http, END_POINTS, ANALYTICS_OPTIONS],
          provide: SantechIntegration,
          useClass: SantechIntegration,
        },
        {
          provide: ANALYTICS,
          useFactory: analyticsFactory,
        },
        config.analyticsOptionsProvider
          ? config.analyticsOptionsProvider
          : {
            provide: ANALYTICS_OPTIONS,
            useValue: null,
          },
      ],
    };
  }

  constructor(integration: SantechIntegration) {
    analytics.add(integration);
    analytics.init();
  }
}
