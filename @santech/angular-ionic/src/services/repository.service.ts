import { Inject, Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';
import { CACHE_TTL } from '../tokens/cache-ttl.token';

@Injectable()
export class RepositoryService {
  private _cache: CacheService;

  constructor(cache: CacheService, @Inject(CACHE_TTL) cacheTTL: number) {
    cache.setDefaultTTL(cacheTTL);
    this._cache = cache;
  }

  public getItem(key: string) {
    return this._cache.getItem(key);
  }

  public cacheItem(key: string, result: any) {
    return this._cache.saveItem(key, result);
  }

  public clearAll() {
    return this._cache.clearAll();
  }
}
