import { Directive, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform } from 'ionic-angular';
import { cordovaPlatform } from '../models/cordova';

@Directive({
  providers: [SplashScreen],
  selector: '[hide-splash-screen]',
})
export class HideSplashScreenDirective implements OnInit {
  private _splashScreen: SplashScreen;
  private _platform: Platform;

  constructor(splashScreen: SplashScreen, platform: Platform) {
    this._splashScreen = splashScreen;
    this._platform = platform;
  }

  public async ngOnInit() {
    const pt = await this._platform.ready();
    if (pt === cordovaPlatform) {
      this._splashScreen.hide();
    }
  }
}
