import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import { cordovaPlatform, KeyboardEnableAccessoryBarDirective, SantechIonicModule } from '..';
import { spyKeyboard, spyPlatform } from '../../testing/ionic';

@Component({
  selector: 'test-keyboard-enable-accessorybar',
  template: `<div keyboard-enable-accessorybar></div>`,
})
class KeyboardEnableAccessoryBarTestComponent { }

describe('Keyboard enable accessory bar directive', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    TestBed
      .configureTestingModule({
        declarations: [
          KeyboardEnableAccessoryBarTestComponent,
        ],
        imports: [SantechIonicModule],
        providers: [
          { provide: Platform, useValue: spyPlatform },
        ],
      })
      .overrideDirective(KeyboardEnableAccessoryBarDirective, {
        set: {
          providers: [
            { provide: Keyboard, useValue: spyKeyboard },
          ],
        },
      });
  });

  describe('On mobile', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue(cordovaPlatform);
      TestBed.createComponent(KeyboardEnableAccessoryBarTestComponent).autoDetectChanges();
    }));

    it('Should enable accessory bar when platform\'s ready', () => {
      expect(spyKeyboard.hideKeyboardAccessoryBar).toHaveBeenCalledWith(false);
    });
  });

  describe('On desktop', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue('desktop');
      TestBed.createComponent(KeyboardEnableAccessoryBarTestComponent).autoDetectChanges();
    }));

    it('Should not enable accessory bar when platform\'s ready', () => {
      expect(spyKeyboard.hideKeyboardAccessoryBar).not.toHaveBeenCalled();
    });
  });
});
