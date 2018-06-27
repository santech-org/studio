import { Directive, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Params, Router, RouterStateSnapshot } from '@angular/router';
import { IAnalyticsJS } from '@santech/analytics-core';
import { APP_INFORMATION, IAppInformation } from '@santech/angular-common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IAnalyticsPage } from '../interfaces/track-page';
import { ANALYTICS } from '../tokens/analytics.token';

@Directive({
  selector: '[routing-analytics]',
})
export class RoutingAnalyticsDirective implements OnInit, OnDestroy {
  public static parseChildren(children: ActivatedRouteSnapshot[] | undefined, attributes: Params): Params {
    if (!children) {
      return attributes;
    }

    return children.reduce((attr, c) => {
      const params = c.params;

      if (params) {
        attr = { ...attr, ...params };
      }

      return this.parseChildren(c.children, attr);
    }, attributes);
  }
  public static routeToAnalyticsPage(route: RouterStateSnapshot): IAnalyticsPage {
    const root = route.root;
    let url = route.url;

    const attributes = this.parseChildren(root.children, {});

    Object.keys(attributes)
      .forEach((property) => url = url.replace(attributes[property], 'Detail'));

    const [, category, ...path] = url.split('/');

    const name = !path.length
      ? 'Main'
      : path.length > 1 || path[0] === 'Detail'
        ? path.pop() as string
        : path[0];

    return {
      category,
      name,
      properties: {
        attributes,
        name,
        path: path.join('/'),
      },
    };
  }

  @Output()
  public onAnalyticsError = new EventEmitter<Error>();

  private _subscription: Subscription | undefined;
  private _router: Router;
  private _analytics: IAnalyticsJS;
  private _infos: IAppInformation;

  constructor(
    router: Router,
    @Inject(ANALYTICS) analytics: IAnalyticsJS,
    @Inject(APP_INFORMATION) infos: IAppInformation) {
    this._router = router;
    this._analytics = analytics;
    this._infos = infos;
  }

  public ngOnInit() {
    this._subscription = this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        try {
          const { category, name, properties } = RoutingAnalyticsDirective
            .routeToAnalyticsPage(this._router.routerState.snapshot);
          this._analytics.page(`${this._infos.name}-${category}`, name, properties);
        } catch (e) {
          this.onAnalyticsError.emit(e);
        }
      });
  }

  public ngOnDestroy() {
    const subscription = this._subscription;
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
