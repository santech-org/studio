export function platformStorageFactory(window: Window) {
  const storage = window.localStorage;
  if (storage) {
    return storage;
  }
  throw new Error('platformStorageFactory: cannot find global localStorage ! Please provide one or polyfill it');
}
