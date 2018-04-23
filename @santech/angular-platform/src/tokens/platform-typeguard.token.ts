import { InjectionToken } from '@angular/core';
import { platformTypeGuard } from '../interfaces/platform';

export const PLATFORM_TYPE_GUARD = new InjectionToken<platformTypeGuard>('platform');
