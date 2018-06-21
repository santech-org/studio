import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { cordovaPlatform } from '../models/cordova';
import { OneSignalService } from '../services/one-signal.service';

@Directive({
  selector: '[one-signal-auth]',
})
export class OneSignalAuthenticatedlDirective implements OnInit, OnDestroy {
  private _platform: Platform;
  private _oneSignalService: OneSignalService;

  constructor(platform: Platform, oneSignalService: OneSignalService) {
    this._platform = platform;
    this._oneSignalService = oneSignalService;
  }

  public async ngOnInit() {
    if (!await this._isCordova()) {
      return;
    }

    this._oneSignalService.enableNotifications();
  }

  public async ngOnDestroy() {
    if (!await this._isCordova()) {
      return;
    }

    this._oneSignalService.disableNotifications();
  }

  private async _isCordova() {
    return cordovaPlatform === await this._platform.ready();
  }
}
