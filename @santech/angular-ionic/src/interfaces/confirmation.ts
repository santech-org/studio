import { AlertOptions } from '@ionic/core';

export type confirmFunction = (confirmHandler: () => void, cancelHandler: () => void) => AlertOptions;
