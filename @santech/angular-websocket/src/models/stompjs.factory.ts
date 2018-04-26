import * as StompJs from '@stomp/stompjs';

export interface IStompWindow extends Window {
  Stomp: typeof StompJs;
}

export function stompjsFactory(window: IStompWindow) {
  return window.Stomp;
}
