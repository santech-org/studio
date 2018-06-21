import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { cordovaPlatform } from '../models/cordova';
import { OneSignalService } from '../services/one-signal.service';

@Directive({
  selector: '[one-signal]',
})
export class OneSignalDirective implements OnInit, OnDestroy {
  private _platform: Platform;
  private _oneSignalService: OneSignalService;

  constructor(platform: Platform, oneSignalService: OneSignalService) {
    this._platform = platform;
    this._oneSignalService = oneSignalService;
  }

  public async ngOnInit() {
    const pt = await this._platform.ready();
    if (pt !== cordovaPlatform) {
      return;
    }

    this._oneSignalService.init();
  }

  public ngOnDestroy() {
    this._oneSignalService.unsubscribe();
  }
}
