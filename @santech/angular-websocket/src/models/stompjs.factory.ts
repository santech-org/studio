import * as Stomp from '@stomp/stompjs';

export interface IStompWindow extends Window {
  Stomp: typeof Stomp;
}

export function stompjsFactory(window: IStompWindow) {
  return window.Stomp;
}
