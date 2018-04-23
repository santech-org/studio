import { InjectionToken } from '@angular/core';

export const PLATFORM_FETCH = new InjectionToken<typeof fetch>('platformFetch');
