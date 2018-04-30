import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechCropperModule } from '@santech/angular-cropper';
import { SantechPlatformModule } from '@santech/angular-platform';
import { IonicModule } from 'ionic-angular';
import { CacheModule } from 'ionic-cache';
import { BackButtonConfirmDirective } from './directives/back-button-confirm.directive';
import { CameraDirective } from './directives/camera.directive';
import { DemoTogglerDirective } from './directives/demo-toggler.directive';
import { HideSplashScreenDirective } from './directives/hide-splash-screen.directive';
import { KeyboardDisableScrollDirective } from './directives/keyboard-disable-scroll.directive';
import { KeyboardEnableAccessoryBarDirective } from './directives/keyboard-enable-accessorybar.directive';
import { NoNetworkDirective } from './directives/no-network.directive';
import { CacheService } from './services/cache.service';
import { CameraService } from './services/camera.service';
import { DemoTogglerService } from './services/demo-toggler.service';
import { BACK_BUTTON_CONFIRMATION_FUNC } from './tokens/back-button-confirmation.token';
import { CACHE_TTL } from './tokens/cache-ttl.token';
import { DEMO_TOGGLER_DURATION } from './tokens/demo-toggler-duration.token';
import { NETWORK_CONNECTION_DELAY } from './tokens/network-connection-delay.token';

export * from './directives/back-button-confirm.directive';
export * from './directives/camera.directive';
export * from './directives/hide-splash-screen.directive';
export * from './directives/keyboard-disable-scroll.directive';
export * from './directives/keyboard-enable-accessorybar.directive';
export * from './directives/no-network.directive';
export * from './interfaces/camera';
export * from './interfaces/confirmation';
export * from './models/cordova';
export * from './services/demo-toggler.service';
export * from './services/cache.service';
export * from './services/camera.service';
export * from './tokens/back-button-confirmation.token';
export * from './tokens/cache-ttl.token';
export * from './tokens/demo-toggler-duration.token';
export * from './tokens/network-connection-delay.token';

export interface ISantechIonicProviders {
  backBtndefaultProvider?: Provider;
  cacheTTL?: Provider;
  networkConnectionDelayProvider?: Provider;
  demoTogglerDurationProvider?: Provider;
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
  ],
  exports: [
    IonicModule,
    BackButtonConfirmDirective,
    CameraDirective,
    DemoTogglerDirective,
    HideSplashScreenDirective,
    KeyboardDisableScrollDirective,
    KeyboardEnableAccessoryBarDirective,
    NoNetworkDirective,
  ],
  imports: [
    SantechCommonModule.forChild(),
    SantechCropperModule.forChild(),
    SantechPlatformModule.forChild(),
    IonicModule,
    CacheModule.forRoot(),
  ],
  providers: [
    File,
    Camera,
    CameraService,
    CacheService,
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
      ],
    };
  }
}
