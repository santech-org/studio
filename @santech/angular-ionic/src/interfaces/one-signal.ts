import { OSNotification, OSNotificationOpenedResult, OSSubscriptionState } from '@ionic-native/onesignal';
import { Observable } from 'rxjs/Observable';

export interface IOneSignalConfig {
  appId: string;
  googleProjectNumber: string;
}

export interface IOneSignalIds {
  userId: string;
  pushToken: string;
}

export interface ISubscriptionChange {
  from: OSSubscriptionState;
  to: OSSubscriptionState;
}

export interface IOneSignalHandlers {
  notificationOpened: Observable<OSNotificationOpenedResult>;
  notificationReceived: Observable<OSNotification>;
  subscriptionChanged: Observable<ISubscriptionChange>;
}
