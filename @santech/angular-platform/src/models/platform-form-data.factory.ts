export function platformFormDataFactory() {
  const formDataCtor = FormData;
  if (formDataCtor) {
    return formDataCtor;
  }
  throw new Error('platformFormDataFactory: cannot find global FormData ! Please provide one or polyfill it');
}
