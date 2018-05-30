import { Directive, Inject, OnInit } from '@angular/core';
import { Alert, AlertController, App, Platform } from 'ionic-angular';
import { confirmFunction } from '../interfaces/confirmation';
import { cordovaPlatform } from '../models/cordova';
import { BACK_BUTTON_CONFIRMATION_FUNC } from '../tokens/back-button-confirmation.token';

@Directive({
  selector: '[back-button-confirm]',
})
export class BackButtonConfirmDirective implements OnInit {
  private _platform: Platform;
  private _alertCtrl: AlertController;
  private _app: App;
  private _confirmFunction: confirmFunction | undefined;
  private _alert: Alert | undefined;

  constructor(
    platform: Platform,
    alertCtrl: AlertController,
    app: App,
    @Inject(BACK_BUTTON_CONFIRMATION_FUNC) confirmFunc: confirmFunction | undefined) {
    this._platform = platform;
    this._alertCtrl = alertCtrl;
    this._app = app;
    this._confirmFunction = confirmFunc;
  }

  public async ngOnInit() {
    const platform = this._platform;
    const pt = await platform.ready();
    if (pt !== cordovaPlatform) {
      return;
    }
    platform.registerBackButtonAction(() => {
      if (this._alert) {
        return;
      }
      const popPromise = this._app.navPop();
      return popPromise
        ? popPromise
        : this.showAlert();
    });
  }

  public showAlert() {
    const confirmFunc = this._confirmFunction;
    if (confirmFunc) {
      const dismiss = () => {
        alert.dismiss();
        this._alert = undefined;
      };
      const alert = this._alert = this._alertCtrl
        .create(confirmFunc(() => {
          dismiss();
          this._platform.exitApp();
        }, dismiss));
      return alert.present();
    }
    return this._platform.exitApp();
  }
}
