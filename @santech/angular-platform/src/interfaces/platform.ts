export type platform = Window | typeof global;

export type platformTypeGuard = (platform: platform) => platform is Window;
