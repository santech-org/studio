import { Inject, Injectable } from '@angular/core';
import { PLATFORM_LOCATION, PLATFORM_STORAGE } from '@santech/angular-platform';

const storageKey = 'std-demo';

@Injectable()
export class DemoTogglerService {
  private _location: Location;
  private _localStorage: typeof localStorage;

  constructor(@Inject(PLATFORM_LOCATION) location: any, @Inject(PLATFORM_STORAGE) storage: any) {
    this._location = location;
    this._localStorage = storage;
  }

  public isDemo(): boolean {
    return !!this._localStorage.getItem(storageKey);
  }

  public toggle(): void {
    const storage = this._localStorage;
    if (this.isDemo()) {
      storage.removeItem(storageKey);
    } else {
      storage.setItem(storageKey, 'true');
    }
    this._location.reload();
  }
}
