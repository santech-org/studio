export function platformHeadersFactory() {
  const headersCtor = Headers;
  if (headersCtor) {
    return headersCtor;
  }
  throw new Error('platformHeadersFactory: cannot find global Headers ! Please provide one or polyfill it');
}
