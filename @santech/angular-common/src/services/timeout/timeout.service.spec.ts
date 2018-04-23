import { TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { SantechCommonModule } from '../..';
import { TimeoutService } from './timeout.service';

describe('Timeout Service', () => {
  let service: TimeoutService;

  beforeEach(() => jest.useFakeTimers());

  afterEach(() => jest.useRealTimers());

  beforeEach(() => service = TestBed.configureTestingModule({
    imports: [
      SantechPlatformModule.forRoot(),
      SantechCommonModule.forRoot(),
    ],
  }).get(TimeoutService));

  it('Should register a timeout', () => {
    const spy = jest.fn();
    service.setTimeout(spy, 10);
    jest.advanceTimersByTime(9);
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalled();
  });

  it('Should register a timeout with optional delay', () => {
    const spy = jest.fn();
    service.setTimeout(spy);
    jest.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalled();
  });

  it('Calling the remover should clear the timeout', () => {
    const spy = jest.fn();
    const remover = service.setTimeout(spy, 10);
    remover();
    jest.advanceTimersByTime(10);
    expect(spy).not.toHaveBeenCalled();
  });
});
