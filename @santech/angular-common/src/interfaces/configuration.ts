import { Provider } from '@angular/core';

export interface ISantechCommonModuleConfiguration {
  appInformationProvider?: Provider | null | undefined;
  endPointsProvider?: Provider | null | undefined;
  errorHandlerProvider?: Provider | null | undefined;
  authKeysProvider?: Provider | null | undefined;
}
