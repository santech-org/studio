import { InjectionToken } from '@angular/core';
import { IConfigEndPoints } from '../interfaces/end-points';

export const CONFIG_END_POINTS = new InjectionToken<IConfigEndPoints>('configEndPoints');
