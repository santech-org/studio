import { Directive, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { PLATFORM_SET_TIMEOUT } from '@santech/angular-platform';
import { Subscription } from 'rxjs';
import { NETWORK_CONNECTION_DELAY } from '../tokens/network-connection-delay.token';

@Directive({
  providers: [Network],
  selector: '[no-network]',
})
export class NoNetworkDirective implements OnInit, OnDestroy {
  @Output()
  public onConnect = new EventEmitter();

  @Output()
  public onDisconnect = new EventEmitter();

  // Network available by default
  // if no network on bootstrap onDisconnect will fire
  public networkAvailable: boolean = true;

  private _disconnectSubscription: Subscription | undefined;
  private _connectSubscription: Subscription | undefined;
  private _network: Network;
  private _networkConnectionDelay: number;
  private _timeout: typeof setTimeout;

  constructor(
    network: Network,
    @Inject(NETWORK_CONNECTION_DELAY) networkConnectionDelay: number,
    @Inject(PLATFORM_SET_TIMEOUT) timeout: any) {
    this._network = network;
    this._networkConnectionDelay = networkConnectionDelay;
    this._timeout = timeout;
  }

  public ngOnInit() {
    this._connectSubscription = this._network.onConnect()
      .subscribe(() => {
        if (!this.networkAvailable) {
          this._timeout(() => this.onConnect.emit(), this._networkConnectionDelay);
          this.networkAvailable = true;
        }
      });

    this._disconnectSubscription = this._network.onDisconnect()
      .subscribe(() => {
        this.onDisconnect.emit();
        this.networkAvailable = false;
      });
  }

  public ngOnDestroy() {
    const { c, d } = { c: this._connectSubscription, d: this._disconnectSubscription };
    if (c) {
      c.unsubscribe();
    }
    if (d) {
      d.unsubscribe();
    }
  }
}
