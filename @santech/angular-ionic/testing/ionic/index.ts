import { EventEmitter } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Network } from '@ionic-native/network/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { ActionSheetOptions, AlertOptions, LoadingOptions, ModalOptions, ToastOptions } from '@ionic/core';
import { createJestSpyObj, SantechSpyObject } from '@santech/core/testing';

export const actionSheetMethods = ['present', 'dismiss', 'callHandler'];
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
export const platformMethods = ['ready'];
export const splashScreenMethods = ['hide'];
export const toastMethods = ['onDidDismiss', 'present'];
export const toastControllerMethods = ['create'];

export interface ISpyAlert extends HTMLIonAlertElement {
  options: AlertOptions;
  cancel: () => void;
  confirm: () => void;
}

export interface ISpyActionSheet extends HTMLIonActionSheetElement {
  options: ActionSheetOptions;
  callHandler(index: number): void;
}

export interface ISpyLoading extends HTMLIonLoadingElement {
  options: LoadingOptions;
}

export interface ISpyModal extends HTMLIonModalElement {
  options: ModalOptions;
}

export interface ISpyToast extends HTMLIonToastElement {
  options: ToastOptions;
}

let spyActionSheet: SantechSpyObject<ISpyActionSheet>;
let spyActionSheetController: SantechSpyObject<ActionSheetController>;
let spyAlert: SantechSpyObject<ISpyAlert>;
let spyAlertController: SantechSpyObject<AlertController>;
let spyCamera: SantechSpyObject<Camera>;
let spyFile: SantechSpyObject<File>;
let spyKeyboard: SantechSpyObject<Keyboard>;
let spyLoading: SantechSpyObject<ISpyLoading>;
let spyLoadingController: SantechSpyObject<LoadingController>;
let spyModal: SantechSpyObject<ISpyModal>;
let spyModalController: SantechSpyObject<ModalController>;
let spyNetwork: SantechSpyObject<Network>;
let spyOneSignal!: SantechSpyObject<OneSignal>;
let spyPlatform!: SantechSpyObject<Platform>;
let spySplashScreen: SantechSpyObject<SplashScreen>;
let spyToast: SantechSpyObject<ISpyToast>;
let spyToastController: SantechSpyObject<ToastController>;

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
  spyOneSignal = jasmine.createSpyObj('spyOneSignal', oneSignalMethods);
  spyPlatform = jasmine.createSpyObj('spyPlatform', platformMethods);
  spySplashScreen = jasmine.createSpyObj('spySplashScreen', splashScreenMethods);
  spyToast = jasmine.createSpyObj('spyToast', toastMethods);
  spyToastController = jasmine.createSpyObj('spyToastController', toastControllerMethods);

  spyActionSheet.present.and.returnValue(Promise.resolve(spyActionSheet));
  spyActionSheet.callHandler.and.callFake((index: number) => {
    const button = spyActionSheet.options.buttons[index];
    if (!button || typeof button === 'string') {
      throw new Error(`spyActionSheet(callHandler): cannot find handler ${index}`);
    }
    const { handler } = button;
    if (!handler) {
      throw new Error(`spyActionSheet(callHandler): no handler for index ${index}`);
    }

    return handler();
  });
  spyActionSheetController.create.and.callFake((options: ActionSheetOptions & jasmine.Spy & jest.Mock<any>) => {
    spyActionSheet.options = options;
    return spyActionSheet;
  });

  spyAlert.present.and.returnValue(Promise.resolve(spyAlert));
  spyAlertController.create.and.callFake((options: AlertOptions & jasmine.Spy & jest.Mock<any>) => {
    spyAlert.options = options;
    return spyAlert;
  });

  spyLoading.present.and.returnValue(Promise.resolve(spyLoading));
  spyLoadingController.create.and.callFake((options: LoadingOptions & jasmine.Spy & jest.Mock<any>) => {
    spyLoading.options = options;
    return spyLoading;
  });

  spyModal.present.and.returnValue(Promise.resolve(spyModal));
  spyModal.onDidDismiss.and.callFake(() => new Promise((res) => spyModal.dismiss = ((data?: any) => {
    res(data);
    return Promise.resolve(data);
  }) as any));
  spyModalController.create.and.callFake((options: ModalOptions & jasmine.Spy & jest.Mock<any>) => {
    spyModal.options = options;
    return spyModal;
  });

  spyToast.present.and.returnValue(Promise.resolve(spyToast));
  spyToast.onDidDismiss.and.callFake(() => new Promise((res) => spyToast.dismiss = ((data?: any) => {
    res(data);
    return Promise.resolve(data);
  }) as any));
  spyToastController.create.and.callFake((options: ToastOptions & jasmine.Spy & jest.Mock<any>) => {
    spyToast.options = options;
    return spyToast;
  });
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
  spyOneSignal = createJestSpyObj(oneSignalMethods);
  spyPlatform = createJestSpyObj(platformMethods);
  spySplashScreen = createJestSpyObj(splashScreenMethods);
  spyToast = createJestSpyObj(toastMethods);
  spyToastController = createJestSpyObj(toastControllerMethods);

  spyActionSheet.present.mockResolvedValue(spyActionSheet);
  spyActionSheet.callHandler.mockImplementation((index: number) => {
    const button = spyActionSheet.options.buttons[index];
    if (!button || typeof button === 'string') {
      throw new Error(`spyActionSheet(callHandler): cannot find handler ${index}`);
    }
    const { handler } = button;
    if (!handler) {
      throw new Error(`spyActionSheet(callHandler): no handler for index ${index}`);
    }

    return handler();
  });
  spyActionSheetController.create.mockImplementation((options: ActionSheetOptions & jasmine.Spy & jest.Mock<any>) => {
    spyActionSheet.options = options;
    return spyActionSheet;
  });

  spyAlert.present.mockResolvedValue(spyAlert);
  spyAlertController.create.mockImplementation((options: AlertOptions & jasmine.Spy & jest.Mock<any>) => {
    spyAlert.options = options;
    return spyAlert;
  });

  spyLoading.present.mockResolvedValue(spyLoading);
  spyLoadingController.create.mockImplementation((options: LoadingOptions & jasmine.Spy & jest.Mock<any>) => {
    spyLoading.options = options;
    return spyLoading;
  });

  spyModal.present.mockResolvedValue(spyModal);
  spyModal.onDidDismiss.mockImplementation(() => new Promise((res) => spyModal.dismiss = ((data?: any) => {
    res(data);
    return Promise.resolve(data);
  }) as any));
  spyModalController.create.mockImplementation((options: ModalOptions & jasmine.Spy & jest.Mock<any>) => {
    spyModal.options = options;
    return spyModal;
  });

  spyToast.present.mockResolvedValue(spyToast);
  spyToast.onDidDismiss.mockImplementation(() => new Promise((res) => spyToast.dismiss = ((data?: any) => {
    res(data);
    return Promise.resolve(data);
  }) as any));
  spyToastController.create.mockImplementation((options: ToastOptions & jasmine.Spy & jest.Mock<any>) => {
    spyToast.options = options;
    return spyToast;
  });
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
  spyOneSignal,
  spyPlatform,
  spySplashScreen,
  spyToast,
  spyToastController,
};
