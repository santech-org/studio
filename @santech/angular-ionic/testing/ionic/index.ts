import { EventEmitter } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Network } from '@ionic-native/network/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { ActionSheetOptions, AlertOptions } from '@ionic/core';
import { createJestSpyObj, SantechSpyObject } from '@santech/core/testing';

export const actionSheetMethods = ['present', 'dismiss'];
export const actionSheetControllerMethods = ['create'];
export const alertMethods = ['present', 'dismiss'];
export const alertControllerMethods = ['create'];
export const cameraMethods = ['getPicture'];
export const fileMethods = ['readAsDataURL'];
export const keyboardMethods = ['disableScroll', 'hideFormAccessoryBar'];
export const loadingMethods = ['present', 'dismiss'];
export const loadingControllerMethods = ['create'];
export const modalMethods = ['onDidDismiss', 'present'];
export const modalControllerMethods = ['create'];
export const networkMethods = ['onConnect', 'onDisconnect'];
export const platformMethods = ['ready'];
export const splashScreenMethods = ['hide'];
export const viewControllerMethods = ['dismiss'];
export const oneSignalMethods = [
  'startInit',
  'setSubscription',
  'inFocusDisplaying',
  'endInit',
  'sendTags',
  'deleteTags',
  'getIds',
  'handleNotificationReceived',
  'handleNotificationOpened',
  'addSubscriptionObserver',
];

export interface ISpyModal extends HTMLIonModalElement {
  cb: (confirm: boolean) => void;
}

export interface ISpyAlert extends HTMLIonAlertElement {
  cancel: () => void;
  confirm: () => void;
}

let spyActionSheet: SantechSpyObject<HTMLIonActionSheetElement>;
let spyActionSheetController: SantechSpyObject<ActionSheetController>;
let spyAlert: SantechSpyObject<ISpyAlert>;
let spyAlertController: SantechSpyObject<AlertController>;
let spyCamera: SantechSpyObject<Camera>;
let spyFile: SantechSpyObject<File>;
let spyKeyboard: SantechSpyObject<Keyboard>;
let spyLoading: SantechSpyObject<HTMLIonLoadingElement>;
let spyLoadingController: SantechSpyObject<LoadingController>;
let spyModal: SantechSpyObject<ISpyModal>;
let spyModalController: SantechSpyObject<ModalController>;
let spyNetwork: SantechSpyObject<Network>;
let spyPlatform!: SantechSpyObject<Platform>;
let spySplashScreen: SantechSpyObject<SplashScreen>;
let spyOneSignal!: SantechSpyObject<OneSignal>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyActionSheet = jasmine.createSpyObj('spyActionSheet', actionSheetMethods);
  spyActionSheetController = jasmine.createSpyObj('spyActionSheetController', actionSheetControllerMethods);
  spyAlert = jasmine.createSpyObj('spyAlert', alertMethods);
  spyAlertController = jasmine.createSpyObj('spyAlert', alertControllerMethods);
  spyCamera = jasmine.createSpyObj('spyCamera', cameraMethods);
  spyFile = jasmine.createSpyObj('spyFile', fileMethods);
  spyKeyboard = jasmine.createSpyObj('spyKeyboard', keyboardMethods);
  spyLoading = jasmine.createSpyObj('spyLoading', loadingMethods);
  spyLoadingController = jasmine.createSpyObj('spyLoadingController', loadingControllerMethods);
  spyModal = jasmine.createSpyObj('spyModal', modalMethods);
  spyModalController = jasmine.createSpyObj('spyModalController', modalControllerMethods);
  spyNetwork = jasmine.createSpyObj('spyNetwork', networkMethods);
  spyPlatform = jasmine.createSpyObj('spyPlatform', platformMethods);
  spyOneSignal = jasmine.createSpyObj('spyOneSignal', oneSignalMethods);

  spySplashScreen = jasmine.createSpyObj('spySplashScreen', splashScreenMethods);

  spyActionSheet.present.and.returnValue(Promise.resolve(spyActionSheet));
  spyActionSheetController.create.and.callFake((opts: ActionSheetOptions) => ({ ...spyActionSheet, ...opts }));

  spyAlert.present.and.returnValue(Promise.resolve(spyAlert));
  spyAlertController.create.and.callFake((opts: AlertOptions) => ({ ...spyAlert, ...opts }));

  spyModal.onDidDismiss.and.callFake((cb: any) => spyModal.cb = cb);
  spyModalController.create.and.returnValue(spyModal);

} else if (typeof jest !== 'undefined') {
  spyActionSheet = createJestSpyObj(actionSheetMethods);
  spyActionSheetController = createJestSpyObj(actionSheetControllerMethods);
  spyAlert = createJestSpyObj(alertMethods);
  spyAlertController = createJestSpyObj(alertControllerMethods);
  spyCamera = createJestSpyObj(cameraMethods);
  spyFile = createJestSpyObj(fileMethods);
  spyKeyboard = createJestSpyObj(keyboardMethods);
  spyLoading = createJestSpyObj(loadingMethods);
  spyLoadingController = createJestSpyObj(loadingControllerMethods);
  spyModal = createJestSpyObj(modalMethods);
  spyModalController = createJestSpyObj(modalControllerMethods);
  spyNetwork = createJestSpyObj(networkMethods);
  spyPlatform = createJestSpyObj(platformMethods);
  spyOneSignal = createJestSpyObj(oneSignalMethods);

  spySplashScreen = createJestSpyObj(splashScreenMethods);

  spyActionSheet.present.mockResolvedValue(spyActionSheet);
  spyActionSheetController.create.mockImplementation((opts: ActionSheetOptions) => ({ ...spyActionSheet, ...opts }));

  spyAlert.present.mockResolvedValue(spyAlert);
  spyAlertController.create.mockImplementation((opts: AlertOptions) => ({ ...spyAlert, ...opts }));

  spyModal.onDidDismiss.mockImplementation((cb: any) => spyModal.cb = cb);
  spyModalController.create.mockReturnValue(spyModal);
}

if (spyPlatform) {
  const pause = new EventEmitter<Event>();
  const resume = new EventEmitter<Event>();
  const backButton = new EventEmitter<Event>();
  Object.defineProperty(spyPlatform, 'pause', {
    enumerable: true,
    get: () => pause,
  });
  Object.defineProperty(spyPlatform, 'resume', {
    enumerable: true,
    get: () => resume,
  });
  Object.defineProperty(spyPlatform, 'backButton', {
    enumerable: true,
    get: () => backButton,
  });
}

if (spyOneSignal) {
  Object.defineProperty(spyOneSignal, 'OSInFocusDisplayOption', {
    enumerable: true,
    get: () => ({
      InAppAlert: 1,
      None: 0,
      Notification: 2,
    }),
  });
}

export {
  spyActionSheet,
  spyActionSheetController,
  spyAlert,
  spyAlertController,
  spyCamera,
  spyFile,
  spyKeyboard,
  spyLoading,
  spyLoadingController,
  spyModal,
  spyModalController,
  spyNetwork,
  spyPlatform,
  spySplashScreen,
  spyOneSignal,
};
