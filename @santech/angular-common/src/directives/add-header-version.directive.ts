import { Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@santech/core';
import { IAppInformation } from '../interfaces/app-information';
import { APP_INFORMATION } from '../tokens/app-information.token';

@Directive({
  selector: '[add-header-version]',
})
export class AddHeaderVersionDirective implements OnInit, OnDestroy {
  private _http: Http;
  private _infos: IAppInformation;
  private _remover: (() => void) | undefined;

  constructor(http: Http, @Inject(APP_INFORMATION) appInfos: IAppInformation) {
    this._http = http;
    this._infos = appInfos;
  }

  public ngOnInit() {
    const appInfos = this._infos;
    const http = this._http;
    const headerVersion = [appInfos.name, appInfos.version].join('-');
    this._remover = http.addInterceptor({
      request: (_, config) => {
        config.headers.append('Version', headerVersion);
        return Promise.resolve(config);
      },
    });
  }

  public ngOnDestroy() {
    const remover = this._remover;
    if (remover) {
      remover();
    }
  }
}
