export interface IlocaleKey {
  [localeKey: string]: string;
}

export interface ILocale {
  [localeNamespace: string]: IlocaleKey | string;
}

export interface ILocaleStore {
  [lng: string]: ILocale;
}
