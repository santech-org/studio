import { InjectionToken } from '@angular/core';
import { IOneSignalConfig } from '../interfaces/one-signal';

export const ONE_SIGNAL_CONFIG = new InjectionToken<IOneSignalConfig>('oneSignalConfig');
