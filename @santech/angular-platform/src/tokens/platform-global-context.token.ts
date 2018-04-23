import { InjectionToken } from '@angular/core';
import { platform } from '../interfaces/platform';

export const PLATFORM_GLOBAL_CONTEXT = new InjectionToken<platform>('platform');
