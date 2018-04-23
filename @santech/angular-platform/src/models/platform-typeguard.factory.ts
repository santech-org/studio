import { isPlatformBrowser } from '@angular/common';
import { platform, platformTypeGuard } from '../interfaces/platform';

export function platformTypeGuardFactory(platformId: any): platformTypeGuard {
  return (_: platform): _ is Window => {
    return isPlatformBrowser(platformId);
  };
}
