export function platformNavigatorFactory(window: Window) {
  const navigator = window.navigator;
  if (navigator) {
    return navigator;
  }
  throw new Error('platformNavigatorFactory: cannot find global navigator !');
}
