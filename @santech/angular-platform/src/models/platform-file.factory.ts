export function platformFileFactory() {
  const fileCtor = File;
  if (fileCtor) {
    return fileCtor;
  }
  throw new Error('platformFileFactory: cannot find global File ! Please provide one or polyfill it');
}
