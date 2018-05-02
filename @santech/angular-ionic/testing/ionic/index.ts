import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { createJestSpyObj, SantechSpyObject } from '@santech/core/testing';
import {
  ActionSheet,
  ActionSheetController,
  ActionSheetOptions,
  Alert,
  AlertController,
  AlertOptions,
  App,
  Loading,
  LoadingController,
  Modal,
  ModalController,
  NavController,
  NavParams,
  Platform,
  ViewController,
} from 'ionic-angular';

export const actionSheetMethods = ['present', 'dismiss'];
export const actionSheetControllerMethods = ['create'];
export const alertMethods = ['present', 'dismiss'];
export const alertControllerMethods = ['create'];
export const appMethods = ['getRootNav', 'navPop'];
export const cameraMethods = ['getPicture'];
export const keyboardMethods = ['disableScroll', 'hideKeyboardAccessoryBar'];
export const loadingMethods = ['present', 'dismiss'];
export const loadingControllerMethods = ['create'];
export const modalMethods = ['onDidDismiss', 'present'];
export const modalControllerMethods = ['create'];
export const networkMethods = ['onConnect', 'onDisconnect'];
export const navControllerMethods = [
  'getByIndex',
  'getViews',
  'pop',
  'popTo',
  'push',
  'registerChildNav',
  'setRoot',
  'unregisterChildNav',
];
export const navParamsMethods = ['get'];
export const platformMethods = ['ready', 'registerBackButtonAction', 'exitApp'];
export const splashScreenMethods = ['hide'];
export const viewControllerMethods = ['dismiss'];

export interface ISpyModal extends Modal {
  cb: (confirm: boolean) => void;
}

export interface ISpyAlert extends Alert {
  cancel: () => void;
  confirm: () => void;
}

let spyActionSheet: SantechSpyObject<ActionSheet>;
let spyActionSheetController: SantechSpyObject<ActionSheetController>;
let spyAlert: SantechSpyObject<ISpyAlert>;
let spyAlertController: SantechSpyObject<AlertController>;
let spyApp: SantechSpyObject<App>;
let spyCamera: SantechSpyObject<Camera>;
let spyKeyboard: SantechSpyObject<Keyboard>;
let spyLoading: SantechSpyObject<Loading>;
let spyLoadingController: SantechSpyObject<LoadingController>;
let spyModal: SantechSpyObject<ISpyModal>;
let spyModalController: SantechSpyObject<ModalController>;
let spyNavController: SantechSpyObject<NavController>;
let spyNavParams: SantechSpyObject<NavParams>;
let spyNetwork: SantechSpyObject<Network>;
let spyPlatform: SantechSpyObject<Platform>;
let spySplashScreen: SantechSpyObject<SplashScreen>;
let spyViewController: SantechSpyObject<ViewController>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyActionSheet = jasmine.createSpyObj('spyActionSheet', actionSheetMethods);
  spyActionSheetController = jasmine.createSpyObj('spyActionSheetController', actionSheetControllerMethods);
  spyAlert = jasmine.createSpyObj('spyAlert', alertMethods);
  spyAlertController = jasmine.createSpyObj('spyAlert', alertControllerMethods);
  spyApp = jasmine.createSpyObj('spyApp', appMethods);
  spyCamera = jasmine.createSpyObj('spyCamera', cameraMethods);
  spyKeyboard = jasmine.createSpyObj('spyKeyboard', keyboardMethods);
  spyLoading = jasmine.createSpyObj('spyLoading', loadingMethods);
  spyLoadingController = jasmine.createSpyObj('spyLoadingController', loadingControllerMethods);
  spyModal = jasmine.createSpyObj('spyModal', modalMethods);
  spyModalController = jasmine.createSpyObj('spyModalController', modalControllerMethods);
  spyNavController = jasmine.createSpyObj('spyNavController', navControllerMethods);
  spyNavParams = jasmine.createSpyObj('spyNavParams', navParamsMethods);
  spyNetwork = jasmine.createSpyObj('spyNetwork', networkMethods);
  spyPlatform = jasmine.createSpyObj('spyPlatform', platformMethods);
  spySplashScreen = jasmine.createSpyObj('spySplashScreen', splashScreenMethods);
  spyViewController = jasmine.createSpyObj('spyViewController', viewControllerMethods);

  spyActionSheet.present.and.returnValue(Promise.resolve(spyActionSheet));
  spyActionSheetController.create.and.callFake((opts: ActionSheetOptions) => ({ ...spyActionSheet, ...opts }));

  spyAlert.present.and.returnValue(Promise.resolve(spyAlert));
  spyAlertController.create.and.callFake((opts: AlertOptions) => ({ ...spyAlert, ...opts }));

  spyApp.getRootNav.and.returnValue(spyNavController);

  spyModal.onDidDismiss.and.callFake((cb: any) => spyModal.cb = cb);
  spyModalController.create.and.returnValue(spyModal);

} else if (typeof jest !== 'undefined') {
  spyActionSheet = createJestSpyObj(actionSheetMethods);
  spyActionSheetController = createJestSpyObj(actionSheetControllerMethods);
  spyAlert = createJestSpyObj(alertMethods);
  spyAlertController = createJestSpyObj(alertControllerMethods);
  spyApp = createJestSpyObj(appMethods);
  spyCamera = createJestSpyObj(cameraMethods);
  spyKeyboard = createJestSpyObj(keyboardMethods);
  spyLoading = createJestSpyObj(loadingMethods);
  spyLoadingController = createJestSpyObj(loadingControllerMethods);
  spyModal = createJestSpyObj(modalMethods);
  spyModalController = createJestSpyObj(modalControllerMethods);
  spyNavController = createJestSpyObj(navControllerMethods);
  spyNavParams = createJestSpyObj(navParamsMethods);
  spyNetwork = createJestSpyObj(networkMethods);
  spyPlatform = createJestSpyObj(platformMethods);
  spySplashScreen = createJestSpyObj(splashScreenMethods);
  spyViewController = createJestSpyObj(viewControllerMethods);

  spyActionSheet.present.mockResolvedValue(spyActionSheet);
  spyActionSheetController.create.mockImplementation((opts: ActionSheetOptions) => ({ ...spyActionSheet, ...opts }));

  spyAlert.present.mockResolvedValue(spyAlert);
  spyAlertController.create.mockImplementation((opts: AlertOptions) => ({ ...spyAlert, ...opts }));

  spyApp.getRootNav.mockReturnValue(spyNavController);

  spyModal.onDidDismiss.mockImplementation((cb: any) => spyModal.cb = cb);
  spyModalController.create.mockReturnValue(spyModal);
}

export {
  spyActionSheet,
  spyActionSheetController,
  spyAlert,
  spyAlertController,
  spyApp,
  spyCamera,
  spyKeyboard,
  spyLoading,
  spyLoadingController,
  spyModal,
  spyModalController,
  spyNavController,
  spyNavParams,
  spyNetwork,
  spyPlatform,
  spySplashScreen,
  spyViewController,
};
