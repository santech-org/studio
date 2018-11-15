import { InjectionToken } from '@angular/core';
import { ICacheConfig } from '../interfaces/cache';

export const CACHE_CONFIG = new InjectionToken<ICacheConfig>('cacheConfig');
