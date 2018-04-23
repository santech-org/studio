import { platform, platformTypeGuard } from '../interfaces/platform';

const platformGlobalContextFactory = ((global: platform) =>
  (isBrowser: platformTypeGuard) =>
    // @ts-ignore
    isBrowser(global) ? window : global)(this);

export {
  platformGlobalContextFactory,
};
