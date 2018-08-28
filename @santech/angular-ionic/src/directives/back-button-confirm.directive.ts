import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { cordovaPlatform } from '../models/cordova';
import { NavigationService } from '../services/navigation.service';

@Directive({
  selector: '[back-button-confirm]',
})
export class BackButtonConfirmDirective implements OnInit, OnDestroy {
  private _platform: Platform;
  private _subscription: Subscription | undefined;
  private _navigationService: NavigationService;

  constructor(platform: Platform, navigationService: NavigationService) {
    this._platform = platform;
    this._navigationService = navigationService;
  }

  public async ngOnInit() {
    const platform = this._platform;
    const pt = await this._platform.ready();
    if (pt !== cordovaPlatform) {
      return;
    }
    this._subscription = platform.backButton
      .subscribe(() => this._navigationService.handleBackButton());
  }

  public ngOnDestroy() {
    const subscription = this._subscription;
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
