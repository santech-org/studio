import { Provider } from '@angular/core';

export interface ISantechPlatformModuleConfiguration {
  atobProvider?: Provider | null | undefined;
  blobProvider?: Provider | null | undefined;
  fetchProvider?: Provider | null | undefined;
  storageProvider?: Provider | null | undefined;
  fileReaderProvider?: Provider | null | undefined;
  formDataProvider?: Provider | null | undefined;
  headersProvider?: Provider | null | undefined;
}
