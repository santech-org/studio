import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController, Platform } from '@ionic/angular';
import { spyLocation } from '@santech/angular-common/testing';
import { PLATFORM_GLOBAL_CONTEXT } from '@santech/angular-platform';
import {
  BACK_BUTTON_CONFIRMATION_FUNC,
  confirmFunction,
  cordovaPlatform,
  SantechIonicModule,
} from '..';
import { spyAlert, spyAlertController, spyPlatform } from '../../testing/ionic';

@Component({
  selector: 'test-back-button-confirm',
  template: `<div back-button-confirm></div>`,
})
class BackButtonConfirmTestComponent { }

describe('Back button confirm directive', () => {
  let fixture: ComponentFixture<BackButtonConfirmTestComponent>;
  let history: string[];
  let app: any;

  beforeEach(() => {
    jest.resetAllMocks();
    spyAlertController.create.mockReturnValue(spyAlert);
  });

  afterEach(() => fixture.destroy());

  describe('When no confirmation function is provided', () => {
    beforeEach(() => {
      const mockWindow = {
        history: [],
        navigator: {
          app: {
            exitApp: jest.fn(),
          },
        },
      };

      TestBed
        .configureTestingModule({
          declarations: [
            BackButtonConfirmTestComponent,
          ],
          imports: [
            SantechIonicModule.forRoot(),
          ],
          providers: [
            { provide: Location, useValue: spyLocation },
            { provide: Platform, useValue: spyPlatform },
            { provide: AlertController, useValue: spyAlertController },
            { provide: PLATFORM_GLOBAL_CONTEXT, useValue: mockWindow },
          ],
        });

      history = TestBed.get(PLATFORM_GLOBAL_CONTEXT).history;
      app = TestBed.get(PLATFORM_GLOBAL_CONTEXT).navigator.app;
    });

    describe('On desktop', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue('desktop');
        fixture = TestBed.createComponent(BackButtonConfirmTestComponent);
        fixture.autoDetectChanges();
      }));

      it('Should not register back button action when platform\'s ready', () => {
        spyPlatform.backButton.emit();
        expect(spyLocation.back).not.toHaveBeenCalled();
        expect(app.exitApp).not.toHaveBeenCalled();
      });
    });

    describe('On mobile', () => {
      beforeEach(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
      });

      describe('When no navigation history', () => {
        beforeEach(async(() => {
          fixture = TestBed.createComponent(BackButtonConfirmTestComponent);
          fixture.autoDetectChanges();
        }));

        describe('When user press back button', () => {
          it('Should exit app', () => {
            spyPlatform.backButton.emit();
            expect(spyLocation.back).not.toHaveBeenCalled();
            expect(app.exitApp).toHaveBeenCalled();
          });
        });
      });

      describe('When navigation history', () => {
        beforeEach(async(() => {
          fixture = TestBed.createComponent(BackButtonConfirmTestComponent);
          fixture.autoDetectChanges();
        }));

        it('Should not exit app as we can get back in history', () => {
          history.push('url');
          spyPlatform.backButton.emit();
          expect(app.exitApp).not.toHaveBeenCalled();
          expect(spyLocation.back).toHaveBeenCalled();
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
      const mockWindow = {
        history: [],
        navigator: {
          app: {
            exitApp: jest.fn(),
          },
        },
      };

      TestBed
        .configureTestingModule({
          declarations: [
            BackButtonConfirmTestComponent,
          ],
          imports: [
            SantechIonicModule.forRoot({
              backBtndefaultProvider: {
                provide: BACK_BUTTON_CONFIRMATION_FUNC,
                useValue: backButtonConfirmationFunc,
              },
            }),
          ],
          providers: [
            { provide: Location, useValue: spyLocation },
            { provide: Platform, useValue: spyPlatform },
            { provide: AlertController, useValue: spyAlertController },
            { provide: PLATFORM_GLOBAL_CONTEXT, useValue: mockWindow },
          ],
        });

      history = TestBed.get(PLATFORM_GLOBAL_CONTEXT).history;
      app = TestBed.get(PLATFORM_GLOBAL_CONTEXT).navigator.app;
    });

    describe('On desktop', () => {
      beforeEach(async(() => {
        spyPlatform.ready.mockResolvedValue('desktop');
        TestBed.createComponent(BackButtonConfirmTestComponent).autoDetectChanges();
      }));

      it('Should not register back button action when platform\'s ready', () => {
        spyPlatform.backButton.emit();
        expect(spyLocation.back).not.toHaveBeenCalled();
        expect(app.exitApp).not.toHaveBeenCalled();
      });
    });

    describe('On mobile', () => {
      beforeEach(() => {
        spyPlatform.ready.mockResolvedValue(cordovaPlatform);
      });

      describe('When no navigation history', () => {
        beforeEach(async(() => {
          fixture = TestBed.createComponent(BackButtonConfirmTestComponent);
          fixture.autoDetectChanges();
        }));

        describe('When user press back button', () => {
          beforeEach(() => spyPlatform.backButton.emit());

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
              expect(app.exitApp).toHaveBeenCalled();
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
      });

      describe('When navigation history', () => {
        beforeEach(async(() => {
          fixture = TestBed.createComponent(BackButtonConfirmTestComponent);
          fixture.autoDetectChanges();
        }));

        it('Should not show confirm popup as we can get back in history', () => {
          history.push('url');
          spyPlatform.backButton.emit();
          expect(spyAlertController.create).not.toHaveBeenCalled();
          expect(spyAlert.present).not.toHaveBeenCalled();
          expect(spyLocation.back).toHaveBeenCalled();
        });
      });
    });
  });
});
