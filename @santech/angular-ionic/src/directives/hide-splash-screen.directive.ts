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

  public ngOnInit() {
    this._platform.ready()
      .then((source) => source === cordovaPlatform
        ? this._splashScreen.hide()
        : null);
  }
}
