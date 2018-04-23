import { InjectionToken } from '@angular/core';
import * as SockJs from 'sockjs-client';

export const SOCKJS_CLIENT = new InjectionToken<typeof SockJs>('sockjsClient');
