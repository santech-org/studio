import { Directive, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IAnalyticsJS } from '@santech/analytics-core';
import { APP_INFORMATION, IAppInformation } from '@santech/angular-common';
import { Subject, Subscription } from 'rxjs';
import { ITrackEvent } from '../interfaces/track-event';
import { ANALYTICS } from '../tokens/analytics.token';

@Directive({
  selector: '[track-event]',
})
export class TrackEventDirective implements OnInit, OnDestroy {
  @Input()
  public event?: Subject<ITrackEvent> | undefined;

  private _subscription: Subscription | undefined;

  private _analytics: IAnalyticsJS;
  private _infos: IAppInformation;

  constructor(@Inject(ANALYTICS) analytics: IAnalyticsJS, @Inject(APP_INFORMATION) infos: IAppInformation) {
    this._analytics = analytics;
    this._infos = infos;
  }

  public ngOnInit() {
    if (!this.event) {
      return;
    }

    this._subscription = this.event
      .subscribe(({event, properties, options}) => this._analytics.track(event, {
        ...this._infos,
        ...properties,
      }, options));
  }

  public ngOnDestroy() {
    const subscription = this._subscription;
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
