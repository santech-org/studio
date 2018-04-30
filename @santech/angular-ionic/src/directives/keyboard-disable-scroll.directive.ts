import { Directive, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import { cordovaPlatform } from '../models/cordova';

@Directive({
  providers: [Keyboard],
  selector: '[keyboard-disable-scroll]',
})
export class KeyboardDisableScrollDirective implements OnInit {
  private _keyboard: Keyboard;
  private _platform: Platform;

  constructor(keyboard: Keyboard, platform: Platform) {
    this._keyboard = keyboard;
    this._platform = platform;
  }

  public ngOnInit() {
    this._platform.ready()
      .then((source) => source === cordovaPlatform
        ? this._keyboard.disableScroll(true)
        : null);
  }
}