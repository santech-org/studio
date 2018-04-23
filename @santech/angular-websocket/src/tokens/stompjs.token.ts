import { InjectionToken } from '@angular/core';
import * as Stomp from '@stomp/stompjs';

export const STOMPJS = new InjectionToken<typeof Stomp>('stompjs');
