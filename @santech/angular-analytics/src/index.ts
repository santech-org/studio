import { ModuleWithProviders, NgModule } from '@angular/core';
import { analytics, IAnalyticsJS } from '@santech/analytics-core';
import { SantechIntegration } from '@santech/analytics-integration';
import { END_POINTS } from '@santech/angular-common';
import { Http } from '@santech/core';
import { RoutingAnalyticsDirective } from './directives/routing-analytics.directive';
import { TrackClickDirective } from './directives/track-click.directive';
import { ISantechAnalyticsModuleConfiguration } from './interfaces/configuration';
import { ANALYTICS_OPTIONS } from './tokens/analytics-options.token';
import { ANALYTICS } from './tokens/analytics.token';

export * from './directives/routing-analytics.directive';
export * from './directives/track-click.directive';
export * from './interfaces/configuration';
export * from './interfaces/track-event';
export * from './interfaces/track-page';
export * from './tokens/analytics-options.token';
export * from './tokens/analytics-resolvers.token';
export * from './tokens/analytics.token';

export function analyticsFactory(): IAnalyticsJS {
  return analytics;
}

@NgModule({
  declarations: [
    RoutingAnalyticsDirective,
    TrackClickDirective,
  ],
  exports: [
    RoutingAnalyticsDirective,
    TrackClickDirective,
  ],
})
export class SantechAnalyticsModule {
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
