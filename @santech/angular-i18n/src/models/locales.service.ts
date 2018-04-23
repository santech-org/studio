import { Inject, Injectable } from '@angular/core';
import { ILocaleStore } from '../interfaces/locales';
import { LOCALES } from '../tokens/locales.token';
import { LocalesStore } from './locales.store';

@Injectable()
export class LocalesService {
  private _store: LocalesStore;
  private _locales: ILocaleStore;
  private _labels: { [key: string]: string };

  constructor(store: LocalesStore, @Inject(LOCALES) locales: ILocaleStore) {
    this._store = store;
    this._locales = locales;
  }

  public init(labels?: string[]) {
    this._store.init(this._locales)
      .subscribe(() => this._labels = labels ? this.translate(labels) : {});
  }

  public translate(key: string | string[], params?: any) {
    return this._store.translate(key, params);
  }

  public getLabel(key: string) {
    return this._labels[key] || '';
  }
}
