import { Location } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PLATFORM_GLOBAL_CONTEXT } from '@santech/angular-platform';
import { confirmFunction } from '../interfaces/confirmation';
import { BACK_BUTTON_CONFIRMATION_FUNC } from '../tokens/back-button-confirmation.token';

@Injectable()
export class NavigationService {
  private _alertCtrl: AlertController;
  private _location: Location;
  private _window: Window;
  private _confirmFunc: confirmFunction | undefined;
  private _alert: HTMLIonAlertElement | undefined;

  constructor(
    alertCtrl: AlertController,
    location: Location,
    @Inject(BACK_BUTTON_CONFIRMATION_FUNC) confirmFunc: confirmFunction | undefined,
    @Inject(PLATFORM_GLOBAL_CONTEXT) window: any,
  ) {
    this._alertCtrl = alertCtrl;
    this._confirmFunc = confirmFunc;
    this._location = location;
    this._window = window;
  }

  public handleBackButton() {
    if (this._alert) {
      return;
    }
    const canGoBack = this._window.history.length;
    return canGoBack > 0
      ? this._location.back()
      : this._showAlert();
  }

  public exitApp() {
    (this._window.navigator as any).app.exitApp();
  }

  private async _showAlert() {
    const confirmFunc = this._confirmFunc;
    if (confirmFunc) {
      const dismiss = () => {
        alert.dismiss();
        this._alert = undefined;
      };
      const alert = this._alert = await this._alertCtrl
        .create(confirmFunc(() => {
          dismiss();
          this.exitApp();
        }, dismiss));
      return alert.present();
    }
    return this.exitApp();
  }
}
