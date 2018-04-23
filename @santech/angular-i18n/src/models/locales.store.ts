import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ILocaleStore } from '../interfaces/locales';

@Injectable()
export class LocalesStore {
  private _translateService: TranslateService;
  private _navLng: string;

  constructor(translateService: TranslateService, @Inject(LOCALE_ID) navLng: string) {
    this._navLng = navLng;
    this._translateService = translateService;
  }

  public init(locales: ILocaleStore): Observable<any> {
    const translate = this._translateService;
    switch (this._navLng) {
      case 'en':
        translate.setTranslation('en', locales.en);
        registerLocaleData(localeEn);
        break;
      default:
        translate.setTranslation('fr', locales.fr);
        registerLocaleData(localeFr);
        break;
    }
    translate.setDefaultLang('fr');
    return translate.use(this._navLng);
  }

  public translate(key: string | string[], params?: any) {
    return this._translateService.instant(key, params);
  }
}
