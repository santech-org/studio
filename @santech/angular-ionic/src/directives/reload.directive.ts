import { Directive, Inject, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PLATFORM_LOCATION } from '@santech/angular-platform';
import { Subscription } from 'rxjs';
import { TIME_TO_RELOAD } from '../tokens/time-to-reload.token';

@Directive({
  selector: '[reload]',
})
export class ReloadDirective implements OnInit, OnDestroy {
  private _backgroundTime?: number;
  private _timeToReload: number;
  private _platform: Platform;
  private _location: Location;
  private _onResumeSubscription: Subscription | undefined;
  private _onBackgroundSubscription: Subscription | undefined;

  constructor(
    platform: Platform,
    @Inject(PLATFORM_LOCATION) location: any,
    @Inject(TIME_TO_RELOAD) timeToReload: number) {
    this._platform = platform;
    this._location = location;
    this._timeToReload = timeToReload;
  }

  public ngOnInit() {
    const platform = this._platform;
    this._onResumeSubscription = platform.resume.subscribe(() => this._checkBackgroundTime());
    this._onBackgroundSubscription = platform.pause.subscribe(() => this._setBackgroundTime());
  }

  public ngOnDestroy() {
    const  onResumeSubscription = this._onResumeSubscription;
    const  onBackgroundSubscription = this._onBackgroundSubscription;

    if (onResumeSubscription) {
      onResumeSubscription.unsubscribe();
    }

    if (onBackgroundSubscription) {
      onBackgroundSubscription.unsubscribe();
    }
  }

  private _checkBackgroundTime() {
    const backgroundTime = this._backgroundTime;
    if (typeof backgroundTime !== 'number') {
      return;
    }

    if (Date.now() - backgroundTime >= this._timeToReload) {
      this._location.reload();
    }
  }

  private _setBackgroundTime() {
    this._backgroundTime = Date.now();
  }
}
