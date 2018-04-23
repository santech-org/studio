import { platform } from '../interfaces/platform';

export function platformClearTimeoutFactory(context: platform) {
  return context.clearTimeout;
}
