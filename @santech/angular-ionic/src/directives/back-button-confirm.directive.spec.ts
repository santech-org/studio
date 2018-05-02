import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AlertController, App, Platform } from 'ionic-angular';
import {
  BACK_BUTTON_CONFIRMATION_FUNC,
  confirmFunction,
  cordovaPlatform,
  NETWORK_CONNECTION_DELAY,
  SantechIonicModule,
} from '..';
import { spyAlert, spyAlertController, spyApp, spyPlatform } from '../../testing/ionic';

@Component({
  selector: 'test-back-button-confirm',
  template: `<div back-button-confirm></div>`,
})
class BackButtonConfirmTestComponent { }

describe('Back button confirm directive', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    spyApp.navPop.mockReturnValue(undefined);
    spyPlatform.registerBackButtonAction.mockImplementation((cb: () => void) => cb());
    spyAlertController.create.mockReturnValue(spyAlert);
  });

  describe('When no confirmation function is provided', () => {
    beforeEach(() => {
      TestBed
        .configureTestingModule({
          declarations: [
            BackButtonConfirmTestComponent,
          ],
          imports: [SantechIonicModule.forRoot()],
          providers: [
            { provide: Platform, useValue: spyPlatform },
            { provide: App, useValue: spyApp },
            { provide: AlertController, useValue: spyAlertController },
          ],
        });
    });

    describe('On desktop', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue('desktop');
        TestBed.createComponent(BackButtonConfirmTestComponent).autoDetectChanges();
      }));

      it('Should not register back button action when platform\'s ready', () => {
        expect(spyPlatform.registerBackButtonAction).not.toHaveBeenCalled();
      });
    });

    describe('On mobile', () => {
      beforeEach(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
      });

      describe('When navigation cannot pop', () => {
        beforeEach(async(() => {
          TestBed.createComponent(BackButtonConfirmTestComponent).autoDetectChanges();
        }));

        it('Should register back button action when platform\'s ready', () => {
          expect(spyPlatform.registerBackButtonAction).toHaveBeenCalled();
        });

        it('Should try to pop navigation', () => {
          expect(spyApp.navPop).toHaveBeenCalled();
        });

        it('Should exit app', () => {
          expect(spyPlatform.exitApp).toHaveBeenCalled();
        });
      });

      describe('When navigation can pop', () => {
        beforeEach(async(() => {
          spyApp.navPop.mockReturnValue(Promise.resolve());
          TestBed.createComponent(BackButtonConfirmTestComponent).autoDetectChanges();
        }));

        it('Should register back button action when platform\'s ready', () => {
          expect(spyPlatform.registerBackButtonAction).toHaveBeenCalled();
        });

        it('Should try to pop navigation', () => {
          expect(spyApp.navPop).toHaveBeenCalled();
        });

        it('Should not exit app as navigation can be popped', () => {
          expect(spyPlatform.exitApp).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('When confirmation function is provided', () => {
    const backButtonConfirmationFunc: confirmFunction & {
      confirm?(): void,
      cancel?(): void,
    } = (confirmHandler, cancelHandler) => {
      backButtonConfirmationFunc.confirm = confirmHandler;
      backButtonConfirmationFunc.cancel = cancelHandler;
      return {
        buttons: [
          {
            handler: cancelHandler,
            text: 'cancelText',
          },
          {
            handler: confirmHandler,
            text: 'confirmText',
          },
        ],
        message: 'message',
        title: 'title',
      };
    };

    beforeEach(() => {
      TestBed
        .configureTestingModule({
          declarations: [
            BackButtonConfirmTestComponent,
          ],
          imports: [SantechIonicModule.forRoot({
            backBtndefaultProvider: {
              provide: BACK_BUTTON_CONFIRMATION_FUNC,
              useValue: backButtonConfirmationFunc,
            },
            networkConnectionDelayProvider: {
              provide: NETWORK_CONNECTION_DELAY,
              useValue: 0,
            },
          })],
          providers: [
            { provide: Platform, useValue: spyPlatform },
            { provide: App, useValue: spyApp },
            { provide: AlertController, useValue: spyAlertController },
          ],
        });
    });

    describe('On desktop', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue('desktop');
        TestBed.createComponent(BackButtonConfirmTestComponent).autoDetectChanges();
      }));

      it('Should not register back button action when platform\'s ready', () => {
        expect(spyPlatform.registerBackButtonAction).not.toHaveBeenCalled();
      });
    });

    describe('On mobile', () => {
      beforeEach(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
      });

      describe('When navigation cannot pop', () => {
        beforeEach(async(() => {
          TestBed.createComponent(BackButtonConfirmTestComponent).autoDetectChanges();
        }));

        it('Should register back button action when platform\'s ready', () => {
          expect(spyPlatform.registerBackButtonAction).toHaveBeenCalled();
        });

        it('Should try to pop navigation', () => {
          expect(spyApp.navPop).toHaveBeenCalled();
        });

        it('Should show confirm popup', () => {
          expect(spyAlertController.create).toHaveBeenCalledWith({
            buttons: [
              {
                handler: jasmine.any(Function),
                text: 'cancelText',
              },
              {
                handler: jasmine.any(Function),
                text: 'confirmText',
              },
            ],
            message: 'message',
            title: 'title',
          });
          expect(spyAlert.present).toHaveBeenCalled();
        });

        describe('And user confirms', () => {
          beforeEach(() => {
            if (backButtonConfirmationFunc.confirm) {
              backButtonConfirmationFunc.confirm();
            }
          });

          it('Should exit app', () => {
            expect(spyPlatform.exitApp).toHaveBeenCalled();
          });
        });

        describe('And user cancels', () => {
          beforeEach(() => {
            if (backButtonConfirmationFunc.cancel) {
              backButtonConfirmationFunc.cancel();
            }
          });

          it('Should dismiss the popup', () => {
            expect(spyAlert.dismiss).toHaveBeenCalled();
          });
        });
      });

      describe('When navigation can pop', () => {
        beforeEach(async(() => {
          spyApp.navPop.mockReturnValue(Promise.resolve());
          TestBed.createComponent(BackButtonConfirmTestComponent).autoDetectChanges();
        }));

        it('Should register back button action when platform\'s ready', () => {
          expect(spyPlatform.registerBackButtonAction).toHaveBeenCalled();
        });

        it('Should try to pop navigation', () => {
          expect(spyApp.navPop).toHaveBeenCalled();
        });

        it('Should not show confirm popup', () => {
          expect(spyAlertController.create).not.toHaveBeenCalled();
          expect(spyAlert.present).not.toHaveBeenCalled();
        });
      });
    });
  });
});
