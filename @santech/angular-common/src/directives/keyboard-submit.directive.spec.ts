import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { SantechCommonModule } from '..';

@Component({
  selector: 'test-keyboard-submit',
  template: `
    <form keyboard-submit (submit)="submit()"></form>
  `,
})
class TestKeyboardSubmitComponent {
  public submit = jest.fn();
}

describe('KeyboardSubmitDirective', () => {
  let fixture: ComponentFixture<TestKeyboardSubmitComponent>;

  beforeEach(async(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        TestKeyboardSubmitComponent,
      ],
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot(),
      ],
    })
      .createComponent(TestKeyboardSubmitComponent);
    fixture.autoDetectChanges();
  }));

  describe('When I fill form inputs', () => {
    beforeEach(() => {
      // See https://bugs.webkit.org/show_bug.cgi?id=16735
      const event: any = document.createEvent('Events');
      event.initEvent('keydown', true, true);
      event.keyCode = 13;
      event.which = 13;
      fixture.debugElement.nativeElement.querySelector('form').dispatchEvent(event);
    });

    it('Should not submit the form', () => {
      expect(fixture.componentInstance.submit).not.toHaveBeenCalled();
    });
  });

  describe('When I submit my form using ctr+enter', () => {
    beforeEach(() => {
      // See https://bugs.webkit.org/show_bug.cgi?id=16735
      const event: any = document.createEvent('Events');
      event.initEvent('keydown', true, true);
      event.ctrlKey = true;
      event.keyCode = 13;
      event.which = 13;
      fixture.debugElement.nativeElement.querySelector('form').dispatchEvent(event);
    });

    it('Should not submit the form', () => {
      expect(fixture.componentInstance.submit).toHaveBeenCalled();
    });
  });
});
