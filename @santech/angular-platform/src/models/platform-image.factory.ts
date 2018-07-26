export function platformImageFactory() {
  const imageCtor = Image;
  if (imageCtor) {
    return imageCtor;
  }
  throw new Error('platformImageFactory: cannot find global Image ! Please provide one or polyfill it');
}
