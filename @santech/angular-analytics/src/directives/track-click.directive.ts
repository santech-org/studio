import { Directive, HostListener, Inject, Input } from '@angular/core';
import { IAnalyticsJS } from '@santech/analytics-core';
import { APP_INFORMATION, IAppInformation } from '@santech/angular-common';
import { IAnalyticsResolver, IAnalyticsService } from '../interfaces/track-event';
import { ANALYTICS_OPTIONS } from '../tokens/analytics-options.token';
import { ANALYTICS_RESOLVERS } from '../tokens/analytics-resolvers.token';
import { ANALYTICS } from '../tokens/analytics.token';

export interface IResolvers<T, U> {
  [key: string]: IAnalyticsService<T, U>;
}

@Directive({
  selector: '[track-click]',
})
export class TrackClickDirective<Context, Resolvers extends IResolvers<any, Context | undefined>> {
  @Input()
  public event: string = 'track';

  @Input()
  public keys: Array<keyof Resolvers> = [];

  @Input()
  public context: Context | undefined;

  private _analytics: IAnalyticsJS;
  private _options: SegmentAnalytics.SegmentOpts;
  private _infos: IAppInformation;
  private _resolvers: IResolvers<any, Context | undefined>;

  constructor(
    @Inject(ANALYTICS) analytics: IAnalyticsJS,
    @Inject(APP_INFORMATION) infos: IAppInformation,
    @Inject(ANALYTICS_OPTIONS) options: SegmentAnalytics.SegmentOpts,
    @Inject(ANALYTICS_RESOLVERS) resolvers: Array<IAnalyticsResolver<any, Context | undefined>>,
  ) {
    this._analytics = analytics;
    this._infos = infos;
    this._options = options;
    this._resolvers = resolvers.reduce((p: IResolvers<any, Context | undefined>, n) => {
      p[n.key] = n.service;
      return p;
    }, {});
  }

  @HostListener('click')
  public async onClick() {
    const resolvers = this._resolvers as Resolvers;
    const context = this.context;
    return Promise.all(this.keys.map((k) => resolvers[k])
      .map((s) => s.resolveAnalyticsKey(context)))
      .then((properties) => this._analytics.track(this.event, {
        ...this._infos,
        ...properties
          .reduce((p, n) => ({ ...p, ...n })),
      }, this._options));
  }
}
