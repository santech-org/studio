export function platformFetchFactory(window: Window) {
  const fetch = window.fetch;
  if (fetch) {
    return fetch;
  }
  throw new Error('platformFetchFactory: cannot find global fetch ! Please provide one or polyfill it');
}
