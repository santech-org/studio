import { Directive, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Platform } from '@ionic/angular';
import { cordovaPlatform } from '../models/cordova';

@Directive({
  providers: [Keyboard],
  selector: '[keyboard-enable-accessorybar]',
})
export class KeyboardEnableAccessoryBarDirective implements OnInit {
  private _keyboard: Keyboard;
  private _platform: Platform;

  constructor(keyboard: Keyboard, platform: Platform) {
    this._keyboard = keyboard;
    this._platform = platform;
  }

  public async ngOnInit() {
    const pt = await this._platform.ready();
    if (pt === cordovaPlatform) {
      this._keyboard.hideKeyboardAccessoryBar(false);
    }
  }
}
