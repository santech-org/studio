import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechCropperModule } from '@santech/angular-cropper';
import { SantechPlatformModule } from '@santech/angular-platform';
import { IonicModule } from 'ionic-angular';
import { AppAnalyticsDirective } from './directives/app-analytics.directive';
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
import { FileCacheIndexService } from './services/file-cache-index.service';
import { FileCacheService } from './services/file-cache.service';
import { LocalFileService } from './services/local-file.service';
import { OneSignalService } from './services/one-signal.service';
import { BACK_BUTTON_CONFIRMATION_FUNC } from './tokens/back-button-confirmation.token';
import { CACHE_CONFIG } from './tokens/cache-config.token';
import { DEMO_TOGGLER_DURATION } from './tokens/demo-toggler-duration.token';
import { NETWORK_CONNECTION_DELAY } from './tokens/network-connection-delay.token';
import { ONE_SIGNAL_CONFIG } from './tokens/one-signal-config.token';
import { TIME_TO_RELOAD } from './tokens/time-to-reload.token';

export * from './directives/back-button-confirm.directive';
export * from './directives/camera.directive';
export * from './directives/hide-splash-screen.directive';
export * from './directives/keyboard-disable-scroll.directive';
export * from './directives/keyboard-enable-accessorybar.directive';
export * from './directives/no-network.directive';
export * from './directives/one-signal.directive';
export * from './directives/one-signal-authenticated.directive';
export * from './directives/reload.directive';
export * from './interfaces/cache';
export * from './interfaces/camera';
export * from './interfaces/confirmation';
export * from './interfaces/one-signal';
export * from './models/cordova';
export * from './services/demo-toggler.service';
export * from './services/camera.service';
export * from './services/file-cache-index.service';
export * from './services/file-cache.service';
export * from './services/local-file.service';
export * from './services/one-signal.service';
export * from './tokens/back-button-confirmation.token';
export * from './tokens/cache-config.token';
export * from './tokens/demo-toggler-duration.token';
export * from './tokens/network-connection-delay.token';
export * from './tokens/one-signal-config.token';
export * from './tokens/time-to-reload.token';

export interface ISantechIonicProviders {
  backBtndefaultProvider?: Provider;
  networkConnectionDelayProvider?: Provider;
  demoTogglerDurationProvider?: Provider;
  timeToReloadProvider?: Provider;
  oneSignalConfigProvider?: Provider;
  cacheConfigProvider?: Provider;
}

@NgModule({
  declarations: [
    AppAnalyticsDirective,
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
    IonicModule,
    AppAnalyticsDirective,
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
  imports: [
    SantechAnalyticsModule.forChild(),
    SantechCommonModule.forChild(),
    SantechCropperModule.forChild(),
    SantechPlatformModule.forChild(),
    IonicModule,
  ],
  providers: [
    File,
    Camera,
    CameraService,
    FileCacheIndexService,
    FileCacheService,
    LocalFileService,
    OneSignalService,
  ],
})
export class SantechIonicModule {
  public static forRoot(ionicProviders: ISantechIonicProviders = {}): ModuleWithProviders {
    return {
      ngModule: SantechIonicModule,
      providers: [
        DemoTogglerService,
        ionicProviders.backBtndefaultProvider
          ? ionicProviders.backBtndefaultProvider
          : {
            provide: BACK_BUTTON_CONFIRMATION_FUNC,
            useValue: undefined,
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
        ionicProviders.cacheConfigProvider
          ? ionicProviders.cacheConfigProvider
          : {
            provide: CACHE_CONFIG,
            useValue: {
              directory: 'cache',
              maxAge: 24 * 60 * 60 * 1000,
              maxSize: 256 * 1024 * 1024,
            },
          },
      ],
    };
  }
}
