import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { PLATFORM_LOCATION, SantechPlatformModule } from '@santech/angular-platform';
import { spyLocation } from '@santech/angular-platform/testing';
import { Platform } from 'ionic-angular';
import { ReloadDirective, SantechIonicModule, TIME_TO_RELOAD } from '..';
import { spyPlatform } from '../../testing/ionic';

@Component({
  selector: 'reload',
  template: `<div reload></div>`,
})
class ReloadTestComponent {
  @ViewChild(ReloadDirective)
  public reload!: ReloadDirective;
}

describe('Reload directive', () => {
  let fixture: ComponentFixture<ReloadTestComponent>;
  let now = 0;
  const timeToReload = 5;
  const pause = spyPlatform.pause;
  const resume = spyPlatform.resume;

  beforeEach(() => {
    jest.resetAllMocks();

    TestBed
      .configureTestingModule({
        declarations: [
          ReloadTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
      })
      .overrideDirective(ReloadDirective, {
        set: {
          providers: [
            { provide: Platform, useValue: spyPlatform },
            { provide: PLATFORM_LOCATION, useValue: spyLocation },
            { provide: TIME_TO_RELOAD, useValue: timeToReload},
          ],
        },
      });

    now = 0;
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    fixture = TestBed.createComponent(ReloadTestComponent);
    fixture.autoDetectChanges();
  });

  describe('On resume', () => {
    describe('And in background time is not defined', () => {
      beforeEach(() => resume.next());

      it('Should not call reload', () => {
        expect(spyLocation.reload).not.toHaveBeenCalled();
      });
    });

    describe('And in background for MORE than TIME_TO_RELOAD', () => {
      beforeEach(() => {
        pause.next();
        now = now + timeToReload;
        resume.next();
      });

      it('Should call reload', () => {
        expect(spyLocation.reload).toHaveBeenCalledTimes(1);
      });
    });

    describe('And in background for LESS than TIME_TO_RELOAD', () => {
      beforeEach(() => {
        pause.next();
        resume.next();
      });

      it('Should call reload', () => {
        expect(spyLocation.reload).not.toHaveBeenCalled();
      });
    });
  });
});
