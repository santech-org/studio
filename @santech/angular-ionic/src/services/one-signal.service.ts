import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationOpenedResult } from '@ionic-native/onesignal';
import { Subscription } from 'rxjs';
import { IOneSignalConfig, IOneSignalIds, ISubscriptionChange } from '../interfaces/one-signal';
import { ONE_SIGNAL_CONFIG } from '../tokens/one-signal-config.token';

@Injectable()
export class OneSignalService {
  @Output()
  public onInitError = new EventEmitter<Error>();

  @Output()
  public onEnableError = new EventEmitter<Error>();

  @Output()
  public onDisableError = new EventEmitter<Error>();

  @Output()
  public onNotificationOpened = new EventEmitter<OSNotificationOpenedResult>();

  @Output()
  public onNotificationReceived = new EventEmitter<OSNotification>();

  @Output()
  public onSubscriptionChanged = new EventEmitter<ISubscriptionChange>();

  @Output()
  public onNotificationsEnabled = new EventEmitter<IOneSignalIds>();

  private _oneSignal: OneSignal;
  private _oneSignalConfig: IOneSignalConfig;
  private _subscriptions: Subscription[] = [];

  constructor(oneSignal: OneSignal, @Inject(ONE_SIGNAL_CONFIG) oneSignalConfig: IOneSignalConfig) {
    this._oneSignal = oneSignal;
    this._oneSignalConfig = oneSignalConfig;
  }

  public init() {
    try {
      const {appId, googleProjectNumber} = this._oneSignalConfig;
      const oneSignal = this._oneSignal;

      oneSignal.startInit(appId, googleProjectNumber);
      oneSignal.setSubscription(false);
      oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);
      oneSignal.endInit();

      this._subscriptions.push(
        oneSignal.handleNotificationOpened().subscribe((value) => this.onNotificationOpened.emit(value)),
        oneSignal.handleNotificationReceived().subscribe((value) => this.onNotificationReceived.emit(value)),
        oneSignal.addSubscriptionObserver().subscribe((value) => this.onSubscriptionChanged.emit(value)),
      );
    } catch (e) {
      this.onInitError.emit(e);
    }
  }

  public async enableNotifications() {
    try {
      const oneSignal =  this._oneSignal;
      const ids = await oneSignal.getIds();
      oneSignal.setSubscription(true);
      this.onNotificationsEnabled.emit(ids);
    } catch (e) {
      this.onEnableError.emit(e);
    }
  }

  public disableNotifications() {
    try {
      this._oneSignal.setSubscription(false);
    } catch (e) {
      this.onDisableError.emit(e);
    }
  }

  public unsubscribe() {
    return this._subscriptions.forEach((s) => s.unsubscribe());
  }
}
