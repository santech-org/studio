import { InjectionToken } from '@angular/core';
import { ILocaleStore } from '../interfaces/locales';

export const LOCALES = new InjectionToken<ILocaleStore>('locales');
