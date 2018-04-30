import { AlertOptions } from 'ionic-angular';

export type confirmFunction = (confirmHandler: () => void, cancelHandler: () => void) => AlertOptions;
