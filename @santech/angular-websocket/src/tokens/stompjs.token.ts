import { InjectionToken } from '@angular/core';
import * as StompJs from '@stomp/stompjs';

export const STOMPJS = new InjectionToken<typeof StompJs>('stompjs');
