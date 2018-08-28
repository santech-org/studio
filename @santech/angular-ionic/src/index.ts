import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { BackButtonConfirmDirective } from './directives/back-button-confirm.directive';
import { CameraDirective } from './directives/camera.directive';
import { DemoTogglerDirective } from './directives/demo-toggler.directive';
import { HideSplashScreenDirective } from './directives/hide-splash-screen.directive';
import { KeyboardDisableScrollDirective } from './directives/keyboard-disable-scroll.directive';
import { KeyboardEnableAccessoryBarDirective } from './directives/keyboard-enable-accessorybar.directive';
import { NoNetworkDirective } from './directives/no-network.directive';
import { OneSignalAuthenticatedlDirective } from './directives/one-signal-authenticated.directive';
import { OneSignalDirective } from './directives/one-signal.directive';
import { ReloadDirective } from './directives/reload.directive';
import { CameraService } from './services/camera.service';
import { DemoTogglerService } from './services/demo-toggler.service';
import { NavigationService } from './services/navigation.service';
import { OneSignalService } from './services/one-signal.service';
import { RepositoryService } from './services/repository.service';
import { BACK_BUTTON_CONFIRMATION_FUNC } from './tokens/back-button-confirmation.token';
import { CACHE_TTL } from './tokens/cache-ttl.token';
import { DEMO_TOGGLER_DURATION } from './tokens/demo-toggler-duration.token';
import { NETWORK_CONNECTION_DELAY } from './tokens/network-connection-delay.token';
import { ONE_SIGNAL_CONFIG } from './tokens/one-signal-config.token';
import { TIME_TO_RELOAD } from './tokens/time-to-reload.token';

export * from './directives/back-button-confirm.directive';
export * from './directives/camera.directive';
export * from './directives/demo-toggler.directive';
export * from './directives/hide-splash-screen.directive';
export * from './directives/keyboard-disable-scroll.directive';
export * from './directives/keyboard-enable-accessorybar.directive';
export * from './directives/no-network.directive';
export * from './directives/one-signal-authenticated.directive';
export * from './directives/one-signal.directive';
export * from './directives/reload.directive';
export * from './interfaces/camera';
export * from './interfaces/confirmation';
export * from './interfaces/one-signal';
export * from './models/cordova';
export * from './services/camera.service';
export * from './services/demo-toggler.service';
export * from './services/navigation.service';
export * from './services/one-signal.service';
export * from './services/repository.service';
export * from './tokens/back-button-confirmation.token';
export * from './tokens/cache-ttl.token';
export * from './tokens/demo-toggler-duration.token';
export * from './tokens/network-connection-delay.token';
export * from './tokens/one-signal-config.token';
export * from './tokens/time-to-reload.token';

export interface ISantechIonicProviders {
  backBtndefaultProvider?: Provider;
  cacheTTL?: Provider;
  networkConnectionDelayProvider?: Provider;
  demoTogglerDurationProvider?: Provider;
  timeToReloadProvider?: Provider;
  oneSignalConfigProvider?: Provider;
}

@NgModule({
  declarations: [
    BackButtonConfirmDirective,
    CameraDirective,
    DemoTogglerDirective,
    HideSplashScreenDirective,
    KeyboardDisableScrollDirective,
    KeyboardEnableAccessoryBarDirective,
    NoNetworkDirective,
    OneSignalDirective,
    OneSignalAuthenticatedlDirective,
    ReloadDirective,
  ],
  exports: [
    BackButtonConfirmDirective,
    CameraDirective,
    DemoTogglerDirective,
    HideSplashScreenDirective,
    KeyboardDisableScrollDirective,
    KeyboardEnableAccessoryBarDirective,
    NoNetworkDirective,
    OneSignalDirective,
    OneSignalAuthenticatedlDirective,
    ReloadDirective,
  ],
})
export class SantechIonicModule {
  public static forRoot(ionicProviders: ISantechIonicProviders = {}): ModuleWithProviders {
    return {
      ngModule: SantechIonicModule,
      providers: [
        File,
        Camera,
        CameraService,
        RepositoryService,
        OneSignal,
        DemoTogglerService,
        NavigationService,
        OneSignalService,
        ionicProviders.backBtndefaultProvider
          ? ionicProviders.backBtndefaultProvider
          : {
            provide: BACK_BUTTON_CONFIRMATION_FUNC,
            useValue: undefined,
          },
        ionicProviders.cacheTTL
          ? ionicProviders.cacheTTL
          : {
            provide: CACHE_TTL,
            useValue: 86400, // 1 Day
          },
        ionicProviders.networkConnectionDelayProvider
          ? ionicProviders.networkConnectionDelayProvider
          : {
            provide: NETWORK_CONNECTION_DELAY,
            useValue: 3000,
          },
        ionicProviders.demoTogglerDurationProvider
          ? ionicProviders.demoTogglerDurationProvider
          : {
            provide: DEMO_TOGGLER_DURATION,
            useValue: 3000,
          },
        ionicProviders.timeToReloadProvider
          ? ionicProviders.timeToReloadProvider
          : {
            provide: TIME_TO_RELOAD,
            useValue: 5000,
          },
        ionicProviders.oneSignalConfigProvider
          ? ionicProviders.oneSignalConfigProvider
          : {
            provide: ONE_SIGNAL_CONFIG,
            useValue: null,
          },
      ],
    };
  }
}
