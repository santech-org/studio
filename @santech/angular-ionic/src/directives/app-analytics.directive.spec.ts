import { Component, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { spyAnalytics } from '@santech/analytics-core/testing';
import { ANALYTICS, SantechAnalyticsModule } from '@santech/angular-analytics';
import { APP_INFORMATION, SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { App, ViewController } from 'ionic-angular';
import { SantechIonicModule } from '..';
import { spyApp } from '../../testing/ionic';

let navigation: EventEmitter<ViewController>;

// tslint:disable:max-classes-per-file
@Component({
  selector: 'test-app-analytics',
  template: `<div app-analytics></div>`,
})
class AppAnalyticsTestComponent { }

@Component({
  selector: 'test-page',
  template: '',
})
class TestPage { }
// tslint:enable:max-classes-per-file

describe('App Analytics directive', () => {
  let fixture: ComponentFixture<AppAnalyticsTestComponent>;

  beforeEach(async(() => {
    navigation = (spyApp as App).viewDidEnter = new EventEmitter<ViewController>();
    fixture = TestBed
      .configureTestingModule({
        declarations: [
          AppAnalyticsTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot({
            appInformationProvider: {
              provide: APP_INFORMATION,
              useValue: {
                name: 'Application',
                version: 'Version',
              },
            },
          }),
          SantechPlatformModule.forRoot(),
        ],
        providers: [
          { provide: App, useValue: spyApp },
          { provide: ANALYTICS, useValue: spyAnalytics },
        ],
      })
      .createComponent(AppAnalyticsTestComponent);

    fixture.autoDetectChanges();
  }));

  afterEach(() => fixture.destroy());

  describe('When user navigates on main page', () => {
    beforeEach(() => navigation.emit(new ViewController(TestPage)));

    it('Should post page analytics', () => {
      expect(spyAnalytics.page).toHaveBeenCalledWith('Application-Test', 'Main', { attributes: {} });
    });
  });

  describe('When user navigates on detail page', () => {
    describe('And detail data has no id', () => {
      beforeEach(() => navigation.emit(new ViewController(TestPage, { foobar: { foo: 'bar' } })));

      it('Should post page analytics', () => {
        expect(spyAnalytics.page).toHaveBeenCalledWith('Application-Test', 'Detail', { attributes: {} });
      });
    });

    describe('And detail data is exotic', () => {
      beforeEach(() => navigation.emit(new ViewController(TestPage, { foobar: 1, quux: 'baz' })));

      it('Should post page analytics', () => {
        expect(spyAnalytics.page).toHaveBeenCalledWith('Application-Test', 'Detail', { attributes: {} });
      });
    });

    describe('And detail contains data', () => {
      beforeEach(() => navigation.emit(new ViewController(TestPage, { foobar: { id: 'foo' } })));

      it('Should post page analytics', () => {
        expect(spyAnalytics.page).toHaveBeenCalledWith('Application-Test', 'Detail', {
          attributes: {
            foobar: 'foo',
          },
        });
      });
    });
  });
});
