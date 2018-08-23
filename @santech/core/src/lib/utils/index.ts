export const noop = Function.prototype as () => void;

export const identity = <T>(x: T) => x;
