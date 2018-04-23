export function platformDocumentFactory(window: Window) {
  const document = window.document;
  if (document) {
    return document;
  }
  throw new Error('platformDocumentFactory: cannot find global document !');
}
