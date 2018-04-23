export function platformAtobFactory(window: Window) {
  const atob = window.atob;
  if (atob) {
    return atob;
  }
  throw new Error('platformAtobFactory: cannot find global atob ! Please provide one or polyfill it');
}
