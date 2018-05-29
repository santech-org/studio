import { Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import { IAnalyticsJS } from '@santech/analytics-core';
import { ANALYTICS } from '@santech/angular-analytics';
import { APP_INFORMATION, IAppInformation } from '@santech/angular-common';
import { App, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[app-analytics]',
})
export class AppAnalyticsDirective implements OnInit, OnDestroy {
  private _app: App;
  private _analytics: IAnalyticsJS;
  private _infos: IAppInformation;
  private _subscription: Subscription | undefined;

  constructor(app: App, @Inject(ANALYTICS) analytics: IAnalyticsJS, @Inject(APP_INFORMATION) infos: IAppInformation) {
    this._app = app;
    this._analytics = analytics;
    this._infos = infos;
  }

  public ngOnInit() {
    this._subscription = this._app.viewDidEnter
      .subscribe((event: ViewController) => {
        const page = event.component.name.replace('Page', '');
        const data = event.data;
        const dataKeys = Object.keys(data);
        const category = dataKeys.length > 0
          ? 'Detail'
          : 'Main';

        const attributes = dataKeys
          .reduce((res: { [key: string]: any }, k) => {
            const dataKey = data[k];
            if (dataKey) {
              res[k] = dataKey.id;
            }
            return res;
          }, {});

        this._analytics.page([this._infos.name, page].join('-'), category, { attributes });
      });
  }

  public ngOnDestroy() {
    const subscription = this._subscription;
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
