import { ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';
import { ISantechPlatformModuleConfiguration } from './interfaces/configuration';
import { platformAtobFactory } from './models/platform-atob.factory';
import { platformBlobFactory } from './models/platform-blob.factory';
import { platformClearTimeoutFactory } from './models/platform-clear-timeout.factory';
import { platformDocumentFactory } from './models/platform-document.factory';
import { platformFetchFactory } from './models/platform-fetch.factory';
import { platformFileReaderFactory } from './models/platform-file-reader.factory';
import { platformFormDataFactory } from './models/platform-form-data.factory';
import { platformGlobalContextFactory } from './models/platform-global-context.factory';
import { platformHeadersFactory } from './models/platform-headers.factory';
import { platformLocationFactory } from './models/platform-location.factory';
import { platformNavigatorFactory } from './models/platform-navigator.factory';
import { platformSetTimeoutFactory } from './models/platform-set-timeout.factory';
import { platformStorageFactory } from './models/platform-storage.factory';
import { platformTypeGuardFactory } from './models/platform-typeguard.factory';
import { PLATFORM_ATOB } from './tokens/platform-atob.token';
import { PLATFORM_BLOB } from './tokens/platform-blob.token';
import { PLATFORM_CLEAR_TIMEOUT } from './tokens/platform-clear-timeout.token';
import { PLATFORM_DOCUMENT } from './tokens/platform-document.token';
import { PLATFORM_FETCH } from './tokens/platform-fetch.token';
import { PLATFORM_FILE_READER } from './tokens/platform-file-reader.token';
import { PLATFORM_FORM_DATA } from './tokens/platform-form-data.token';
import { PLATFORM_GLOBAL_CONTEXT } from './tokens/platform-global-context.token';
import { PLATFORM_HEADERS } from './tokens/platform-headers.token';
import { PLATFORM_LOCATION } from './tokens/platform-location.token';
import { PLATFORM_NAVIGATOR } from './tokens/platform-navigator.token';
import { PLATFORM_SET_TIMEOUT } from './tokens/platform-set-timeout.token';
import { PLATFORM_STORAGE } from './tokens/platform-storage.token';
import { PLATFORM_TYPE_GUARD } from './tokens/platform-typeguard.token';

export * from './interfaces/configuration';
export * from './interfaces/platform';
export * from './tokens/platform-atob.token';
export * from './tokens/platform-blob.token';
export * from './tokens/platform-clear-timeout.token';
export * from './tokens/platform-document.token';
export * from './tokens/platform-fetch.token';
export * from './tokens/platform-file-reader.token';
export * from './tokens/platform-form-data.token';
export * from './tokens/platform-global-context.token';
export * from './tokens/platform-headers.token';
export * from './tokens/platform-location.token';
export * from './tokens/platform-navigator.token';
export * from './tokens/platform-set-timeout.token';
export * from './tokens/platform-storage.token';
export * from './tokens/platform-typeguard.token';

@NgModule()
export class SantechPlatformModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechPlatformModule,
    };
  }

  public static forRoot(config: ISantechPlatformModuleConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: SantechPlatformModule,
      providers: [
        {
          deps: [PLATFORM_ID],
          provide: PLATFORM_TYPE_GUARD,
          useFactory: platformTypeGuardFactory,
        },
        {
          deps: [PLATFORM_TYPE_GUARD],
          provide: PLATFORM_GLOBAL_CONTEXT,
          useFactory: platformGlobalContextFactory,
        },
        {
          deps: [PLATFORM_GLOBAL_CONTEXT],
          provide: PLATFORM_CLEAR_TIMEOUT,
          useFactory: platformClearTimeoutFactory,
        },
        {
          deps: [PLATFORM_GLOBAL_CONTEXT],
          provide: PLATFORM_DOCUMENT,
          useFactory: platformDocumentFactory,
        },
        {
          deps: [PLATFORM_GLOBAL_CONTEXT],
          provide: PLATFORM_LOCATION,
          useFactory: platformLocationFactory,
        },
        {
          deps: [PLATFORM_GLOBAL_CONTEXT],
          provide: PLATFORM_SET_TIMEOUT,
          useFactory: platformSetTimeoutFactory,
        },
        {
          deps: [PLATFORM_GLOBAL_CONTEXT],
          provide: PLATFORM_NAVIGATOR,
          useFactory: platformNavigatorFactory,
        },
        // window gobals
        config.atobProvider
          ? config.atobProvider
          : {
            deps: [PLATFORM_GLOBAL_CONTEXT],
            provide: PLATFORM_ATOB,
            useFactory: platformAtobFactory,
          },
        config.blobProvider
          ? config.blobProvider
          : {
            deps: [PLATFORM_GLOBAL_CONTEXT],
            provide: PLATFORM_BLOB,
            useFactory: platformBlobFactory,
          },
        config.fetchProvider
          ? config.fetchProvider
          : {
            deps: [PLATFORM_GLOBAL_CONTEXT],
            provide: PLATFORM_FETCH,
            useFactory: platformFetchFactory,
          },
        config.storageProvider
          ? config.storageProvider
          : {
            deps: [PLATFORM_GLOBAL_CONTEXT],
            provide: PLATFORM_STORAGE,
            useFactory: platformStorageFactory,
          },
        // globals
        config.fileReaderProvider
          ? config.fileReaderProvider
          : {
            provide: PLATFORM_FILE_READER,
            useFactory: platformFileReaderFactory,
          },
        config.formDataProvider
          ? config.formDataProvider
          : {
            provide: PLATFORM_FORM_DATA,
            useFactory: platformFormDataFactory,
          },
        config.headersProvider
          ? config.headersProvider
          : {
            provide: PLATFORM_HEADERS,
            useFactory: platformHeadersFactory,
          },
      ],
    };
  }
}
