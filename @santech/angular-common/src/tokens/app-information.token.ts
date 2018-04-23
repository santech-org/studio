import { InjectionToken } from '@angular/core';
import { IAppInformation } from '../interfaces/app-information';

export const APP_INFORMATION = new InjectionToken<IAppInformation>('appInformation');
