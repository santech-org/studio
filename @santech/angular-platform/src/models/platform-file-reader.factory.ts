export function platformFileReaderFactory() {
  const fileReaderCtor = FileReader;
  if (fileReaderCtor) {
    return fileReaderCtor;
  }
  throw new Error('platformFileReaderFactory: cannot find global FileReader ! Please provide one or polyfill it');
}
