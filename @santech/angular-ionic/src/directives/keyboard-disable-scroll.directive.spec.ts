import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Keyboard } from '@ionic-native/keyboard';
import { Platform } from 'ionic-angular';
import { cordovaPlatform, KeyboardDisableScrollDirective, SantechIonicModule } from '..';
import { spyKeyboard, spyPlatform } from '../../testing/ionic';

@Component({
  selector: 'test-keyboard-disable-scroll',
  template: `<div keyboard-disable-scroll></div>`,
})
class KeyboardDisableScrollTestComponent { }

describe('Keyboard disable scroll directive', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    TestBed
      .configureTestingModule({
        declarations: [
          KeyboardDisableScrollTestComponent,
        ],
        imports: [SantechIonicModule],
        providers: [
          { provide: Platform, useValue: spyPlatform },
        ],
      })
      .overrideDirective(KeyboardDisableScrollDirective, {
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
      TestBed.createComponent(KeyboardDisableScrollTestComponent).autoDetectChanges();
    }));

    it('Should disable keyboard scroll when platform\'s ready', () => {
      expect(spyKeyboard.disableScroll).toHaveBeenCalledWith(true);
    });
  });

  describe('On desktop', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue('desktop');
      TestBed.createComponent(KeyboardDisableScrollTestComponent).autoDetectChanges();
    }));

    it('Should not disable keyboard scroll when platform\'s ready', () => {
      expect(spyKeyboard.disableScroll).not.toHaveBeenCalled();
    });
  });
});
