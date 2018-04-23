import { Inject, Injectable } from '@angular/core';
import { PLATFORM_CLEAR_TIMEOUT, PLATFORM_SET_TIMEOUT } from '@santech/angular-platform';

@Injectable()
export class TimeoutService {
  private _setTimeout: typeof setTimeout;
  private _clearTimeout: typeof clearTimeout;

  constructor(@Inject(PLATFORM_SET_TIMEOUT) set: any,
              @Inject(PLATFORM_CLEAR_TIMEOUT) clear: any) {
    this._setTimeout = set;
    this._clearTimeout = clear;
  }

  public setTimeout(callback: () => void, time: number = 0) {
      const id = this._setTimeout(callback, time);
      return () => this._clearTimeout(id);
  }
}
