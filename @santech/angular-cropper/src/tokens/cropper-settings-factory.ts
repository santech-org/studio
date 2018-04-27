import { InjectionToken } from '@angular/core';
import { TCropperSettingsFactory } from '../interfaces/cropper';

export const CROPPER_SETTINGS_FACTORY = new InjectionToken<TCropperSettingsFactory>('cropperSettingsFactory');
