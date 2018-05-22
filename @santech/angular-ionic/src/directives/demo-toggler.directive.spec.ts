import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// tslint:disable-next-line:no-implicit-dependencies
import { By } from '@angular/platform-browser';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule, TimeoutService } from '@santech/angular-common';
import { MockTimeoutService } from '@santech/angular-common/testing';
import { PLATFORM_LOCATION, PLATFORM_STORAGE, SantechPlatformModule } from '@santech/angular-platform';
import { spyLocalstorage, spyLocation } from '@santech/angular-platform/testing';
import { DEMO_TOGGLER_DURATION, SantechIonicModule } from '..';

@Component({
  selector: 'test-demo-toggler',
  template: `<button demo-toggler></button>`,
})
class DemoTogglerTestComponent { }

describe('Demo toggler directive', () => {
  let fixture: ComponentFixture<DemoTogglerTestComponent>;
  const mockTimeoutService = new MockTimeoutService();

  beforeEach(() => {
    jest.resetAllMocks();
    spyLocalstorage.getItem.mockReturnValue(null);
    spyLocalstorage.setItem.mockImplementation((setKey: string, item: any) =>
      spyLocalstorage.getItem.mockImplementation((key: string) => {
        if (key === setKey) {
          return item;
        }
        return null;
      }));
  });

  describe('When no toggle duration is provided', () => {
    beforeEach(async(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [
          DemoTogglerTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
        providers: [
          { provide: PLATFORM_LOCATION, useValue: spyLocation },
          { provide: PLATFORM_STORAGE, useValue: spyLocalstorage },
          { provide: TimeoutService, useValue: mockTimeoutService },
        ],
      })
        .createComponent(DemoTogglerTestComponent);
      fixture.autoDetectChanges();
    }));

    describe('On mobile', () => {
      describe('When I press the button', () => {
        beforeEach(() => fixture.debugElement
          .query(By.css('button')).triggerEventHandler('press', new Event('press')));

        describe('And I release click before toggle duration timeout', () => {
          beforeEach(() => fixture.debugElement
            .query(By.css('button')).triggerEventHandler('touchend', new Event('touchend')));

          it('Should do nothing', () => {
            expect(() => mockTimeoutService.tick()).toThrow();
            expect(spyLocalstorage.getItem).not.toHaveBeenCalledWith('std-demo');
          });
        });

        describe('And I release click after toggle duration timeout', () => {
          beforeEach(() => {
            mockTimeoutService.tick();
            fixture.debugElement
              .query(By.css('button')).triggerEventHandler('touchend', new Event('touchend'));
          });

          it('Should toggle to demo', () => {
            expect(spyLocalstorage.getItem).toHaveBeenCalledWith('std-demo');
            expect(spyLocalstorage.setItem).toHaveBeenCalledWith('std-demo', 'true');
            expect(spyLocation.reload).toHaveBeenCalled();
          });

          describe('And I toggle again', () => {
            beforeEach(() => {
              fixture.debugElement
                .query(By.css('button')).triggerEventHandler('press', new Event('press'));
              mockTimeoutService.tick();
              fixture.debugElement
                .query(By.css('button')).triggerEventHandler('touchend', new Event('touchend'));
            });

            it('Should come back to normal', () => {
              expect(spyLocalstorage.getItem).toHaveBeenCalledWith('std-demo');
              expect(spyLocalstorage.removeItem).toHaveBeenCalledWith('std-demo');
              expect(spyLocation.reload).toHaveBeenCalled();
            });
          });
        });
      });

      describe('On desktop', () => {
        describe('When I press the button', () => {
          beforeEach(() => fixture.debugElement
            .query(By.css('button')).triggerEventHandler('press', new Event('press')));

          describe('And I release click before toggle duration timeout', () => {
            beforeEach(() => fixture.debugElement
              .query(By.css('button')).triggerEventHandler('click', new Event('click')));

            it('Should do nothing', () => {
              expect(() => mockTimeoutService.tick()).toThrow();
              expect(spyLocalstorage.getItem).not.toHaveBeenCalledWith('std-demo');
            });
          });
        });
      });
    });
  });

  describe('When toggle duration is provided', () => {
    it('Should use it', () => {
      expect(TestBed.configureTestingModule({
        imports: [
          SantechIonicModule.forRoot({
            demoTogglerDurationProvider: {
              provide: DEMO_TOGGLER_DURATION,
              useValue: 10000,
            },
          }),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
      })
        .get(DEMO_TOGGLER_DURATION)).toBe(10000);
    });
  });
});
