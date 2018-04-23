import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { SantechCommonModule } from '../..';

@Component({
  selector: 'test-timer',
  template: '<timer (onTick)="tick()"></timer>',
})
class TestTimerComponent {
  public tick = jasmine.createSpy();
}

describe('Timer Component', () => {
  let fixture: ComponentFixture<TestTimerComponent>;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({
      declarations: [
        TestTimerComponent,
      ],
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot(),
      ],
    });

    fixture = TestBed.createComponent(TestTimerComponent);
    fixture.autoDetectChanges();
  });

  afterEach(() => jest.useRealTimers());

  it('Should call the tick callback every minute', () => {
    expect(fixture.componentInstance.tick).not.toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(fixture.componentInstance.tick).toHaveBeenCalledTimes(1);
  });
});
