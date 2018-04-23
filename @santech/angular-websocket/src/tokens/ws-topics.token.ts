import { InjectionToken } from '@angular/core';
import { ITopicSubscription } from '../interfaces/websocket';

export const WS_TOPICS = new InjectionToken<Array<() => ITopicSubscription | Promise<ITopicSubscription>>>('wsTopics');
