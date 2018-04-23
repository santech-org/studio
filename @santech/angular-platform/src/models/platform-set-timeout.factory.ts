import { platform } from '../interfaces/platform';

export function platformSetTimeoutFactory(context: platform) {
  return context.setTimeout;
}
