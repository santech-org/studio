export function platformBlobFactory(window: Window) {
  const blobCtor = window.Blob;
  if (blobCtor) {
    return blobCtor;
  }
  throw new Error('platformBlobFactory: cannot find global Blob ! Please provide one or polyfill it');
}
