import { InjectionToken } from '@angular/core';
import { confirmFunction } from '../interfaces/confirmation';

export const BACK_BUTTON_CONFIRMATION_FUNC = new InjectionToken<confirmFunction>('backButtonConfirmationFunc');
