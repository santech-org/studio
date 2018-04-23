import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { TimeoutService } from '../../services/timeout/timeout.service';

@Component({
  selector: 'timer',
  template: `
    <ng-content></ng-content>
  `,
})
export class TimerComponent implements OnInit {
  @Input('refresh-every')
  public refreshEvery: number = 1000 * 60; // minute

  @Input()
  public relative: boolean = false;

  @Output()
  public onTick = new EventEmitter<void>();

  private _zone: NgZone;
  private _timeoutService: TimeoutService;

  constructor(timeoutService: TimeoutService, zone: NgZone) {
    this._timeoutService = timeoutService;
    this._zone = zone;
  }

  public ngOnInit() {
    this._setDateUpdater();
  }

  private _setDateUpdater() {
    let mustRefreshIn = this.refreshEvery;

    if (!this.relative) {
      const now = new Date();
      const coeff = this.refreshEvery;
      const nextTick = new Date(Math.ceil(now.getTime() / coeff) * coeff);
      mustRefreshIn = nextTick.getTime() - now.getTime();
    }

    this._timeoutService.setTimeout(() => {
      this._zone.run(() => this.onTick.emit());
      this._setDateUpdater();
    }, mustRefreshIn);
  }
}
