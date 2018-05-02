import { Directive, HostListener, Inject } from '@angular/core';
import { TimeoutService } from '@santech/angular-common';
import { DemoTogglerService } from '../services/demo-toggler.service';
import { DEMO_TOGGLER_DURATION } from '../tokens/demo-toggler-duration.token';

@Directive({
  selector: '[demo-toggler]',
})
export class DemoTogglerDirective {
  private _timeout: TimeoutService;
  private _toggler: DemoTogglerService;
  private _duration: number;
  private _clearToggle: (() => void) | undefined;

  constructor(
    timeout: TimeoutService,
    toggler: DemoTogglerService,
    @Inject(DEMO_TOGGLER_DURATION) duration: number) {
    this._timeout = timeout;
    this._toggler = toggler;
    this._duration = duration;
  }

  @HostListener('press')
  public press() {
    this._clearToggle = this._timeout.setTimeout(() => this._toggler.toggle(), this._duration);
  }

  @HostListener('touchend')
  public touchEnd() {
    this._clear();
  }

  @HostListener('click')
  public click() {
    this._clear();
  }

  private _clear() {
    if (typeof this._clearToggle === 'function') {
      this._clearToggle();
    }
  }
}
