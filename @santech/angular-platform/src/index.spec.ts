import { inject, TestBed } from '@angular/core/testing';
import {
  PLATFORM_ATOB,
  PLATFORM_BLOB,
  PLATFORM_CLEAR_TIMEOUT,
  PLATFORM_DOCUMENT,
  PLATFORM_FETCH,
  PLATFORM_FILE_READER,
  PLATFORM_FORM_DATA,
  PLATFORM_GLOBAL_CONTEXT,
  PLATFORM_HEADERS,
  PLATFORM_LOCATION,
  PLATFORM_NAVIGATOR,
  PLATFORM_SET_TIMEOUT,
  PLATFORM_STORAGE,
  SantechPlatformModule,
} from './';

describe('SantechPlatformModule', () => {
  describe('In a browser', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [SantechPlatformModule.forRoot()],
    }));

    describe('When I inject platform global context', () => {
      it('Should return window', inject([PLATFORM_GLOBAL_CONTEXT], (context: Window) => {
        expect(context).toBe(window);
      }));
    });

    describe('When I inject platform global document', () => {
      it('Should return window.document', inject([PLATFORM_DOCUMENT], (document: Document) => {
        expect(document).toBe(window.document);
      }));
    });

    describe('When I inject platform global location', () => {
      it('Should return window.location', inject([PLATFORM_LOCATION], (location: Location) => {
        expect(location).toBe(window.location);
      }));
    });

    describe('When I inject platform global navigator', () => {
      it('Should return window.document', inject([PLATFORM_NAVIGATOR], (navigator: Navigator) => {
        expect(navigator).toBe(window.navigator);
      }));
    });

    describe('When I inject platform global setTimeout', () => {
      it('Should return window.setTimeout', inject([PLATFORM_SET_TIMEOUT], (set: typeof setTimeout) => {
        expect(set).toBe(window.setTimeout);
      }));
    });

    describe('When I inject platform global clearTimeout', () => {
      it('Should return window.clearTimeout', inject([PLATFORM_CLEAR_TIMEOUT], (clear: typeof clearTimeout) => {
        expect(clear).toBe(window.clearTimeout);
      }));
    });

    describe('When I inject platform global atob', () => {
      it('Should return window.atob', inject([PLATFORM_ATOB], (decoder: typeof atob) => {
        expect(decoder).toBe(window.atob);
      }));
    });

    describe('When I inject platform global Blob', () => {
      it('Should return window.Blob', inject([PLATFORM_BLOB], (blobCtor: typeof Blob) => {
        expect(blobCtor).toBe(window.Blob);
      }));
    });

    describe('When I inject platform global fetch', () => {
      it('Should return window.fetch', inject([PLATFORM_FETCH], (client: typeof fetch) => {
        expect(client).toBe(window.fetch);
      }));
    });

    describe('When I inject platform global localStorage', () => {
      it('Should return window.localStorage', inject([PLATFORM_STORAGE], (storage: Storage) => {
        expect(storage).toBe(window.localStorage);
      }));
    });

    describe('When I inject platform global FileReader', () => {
      it('Should return FileReader', inject([PLATFORM_FILE_READER], (fileReaderCtor: typeof FileReader) => {
        expect(fileReaderCtor).toBe(FileReader);
      }));
    });

    describe('When I inject platform global FormData', () => {
      it('Should return FileReader', inject([PLATFORM_FORM_DATA], (formDataCtor: typeof FormData) => {
        expect(formDataCtor).toBe(FormData);
      }));
    });

    describe('When I inject platform global Headers', () => {
      it('Should return Headers', inject([PLATFORM_HEADERS], (headersCtor: typeof Headers) => {
        expect(headersCtor).toBe(Headers);
      }));
    });
  });

  describe('In a server', () => {
    describe('When I provide global variables & constructor', () => {
      beforeEach(() => TestBed.configureTestingModule({
        imports: [SantechPlatformModule.forRoot({
          atobProvider: { provide: PLATFORM_ATOB, useValue: window.atob },
          blobProvider: { provide: PLATFORM_BLOB, useValue: window.Blob },
          fetchProvider: { provide: PLATFORM_FETCH, useValue: window.fetch },
          fileReaderProvider: { provide: PLATFORM_FILE_READER, useValue: FileReader },
          formDataProvider: { provide: PLATFORM_FORM_DATA, useValue: FormData },
          headersProvider: { provide: PLATFORM_HEADERS, useValue: Headers },
          storageProvider: { provide: PLATFORM_STORAGE, useValue: window.localStorage },
        })],
        providers: [
          { provide: PLATFORM_GLOBAL_CONTEXT, useValue: {} },
        ],
      }));

      describe('And I inject provided atob', () => {
        it('Should return window.atob', inject([PLATFORM_ATOB], (decoder: typeof atob) => {
          expect(decoder).toBe(window.atob);
        }));
      });

      describe('And I inject provided Blob', () => {
        it('Should return window.Blob', inject([PLATFORM_BLOB], (blobCtor: typeof Blob) => {
          expect(blobCtor).toBe(window.Blob);
        }));
      });

      describe('And I inject provided fetch', () => {
        it('Should return window.fetch', inject([PLATFORM_FETCH], (client: typeof fetch) => {
          expect(client).toBe(window.fetch);
        }));
      });

      describe('And I inject provided localStorage', () => {
        it('Should return window.localStorage', inject([PLATFORM_STORAGE], (storage: Storage) => {
          expect(storage).toBe(window.localStorage);
        }));
      });

      describe('And I inject provided FileReader', () => {
        it('Should return FileReader', inject([PLATFORM_FILE_READER], (fileReaderCtor: typeof FileReader) => {
          expect(fileReaderCtor).toBe(FileReader);
        }));
      });

      describe('And I inject provided FormData', () => {
        it('Should return FileReader', inject([PLATFORM_FORM_DATA], (formDataCtor: typeof FormData) => {
          expect(formDataCtor).toBe(FormData);
        }));
      });

      describe('And I inject provided Headers', () => {
        it('Should return Headers', inject([PLATFORM_HEADERS], (headersCtor: typeof Headers) => {
          expect(headersCtor).toBe(Headers);
        }));
      });
    });
  });

  describe('In a server or an old browser', () => {
    beforeEach(() => {
      // Never do this in real life !!
      (window as any).Headers = undefined;
      (window as any).FormData = undefined;
      (window as any).FileReader = undefined;
    });

    beforeEach(() => TestBed.configureTestingModule({
      imports: [SantechPlatformModule.forRoot()],
      providers: [
        { provide: PLATFORM_GLOBAL_CONTEXT, useValue: { setTimeout, clearTimeout } },
      ],
    }));

    describe('When I inject platform global document', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_DOCUMENT))
          .toThrow('platformDocumentFactory: cannot find global document !');
      });
    });

    describe('When I inject platform global location', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_LOCATION))
          .toThrow('platformLocationFactory: cannot find global location !');
      });
    });

    describe('When I inject platform global navigator', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_NAVIGATOR))
          .toThrow('platformNavigatorFactory: cannot find global navigator !');
      });
    });

    describe('When I inject platform global setTimeout', () => {
      it('Should return global.setTimeout', inject([PLATFORM_SET_TIMEOUT], (set: typeof setTimeout) => {
        expect(set).toBe(window.setTimeout);
      }));
    });

    describe('When I inject platform global clearTimeout', () => {
      it('Should return global.clearTimeout', inject([PLATFORM_CLEAR_TIMEOUT], (clear: typeof clearTimeout) => {
        expect(clear).toBe(window.clearTimeout);
      }));
    });

    describe('When I inject platform global atob', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_ATOB))
          .toThrow('platformAtobFactory: cannot find global atob ! Please provide one or polyfill it');
      });
    });

    describe('When I inject platform global Blob', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_BLOB))
          .toThrow('platformBlobFactory: cannot find global Blob ! Please provide one or polyfill it');
      });
    });

    describe('When I inject platform global fetch', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_FETCH))
          .toThrow('platformFetchFactory: cannot find global fetch ! Please provide one or polyfill it');
      });
    });

    describe('When I inject platform global localStorage', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_STORAGE))
          .toThrow('platformStorageFactory: cannot find global localStorage ! Please provide one or polyfill it');
      });
    });

    describe('When I inject platform global FileReader', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_FILE_READER))
          .toThrow('platformFileReaderFactory: cannot find global FileReader ! Please provide one or polyfill it');
      });
    });

    describe('When I inject platform global FormData', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_FORM_DATA))
          .toThrow('platformFormDataFactory: cannot find global FormData ! Please provide one or polyfill it');
      });
    });

    describe('When I inject platform global Headers', () => {
      it('Should throw', () => {
        expect(() => TestBed.get(PLATFORM_HEADERS))
          .toThrow('platformHeadersFactory: cannot find global Headers ! Please provide one or polyfill it');
      });
    });
  });

  describe('When imported in a child module', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forChild(),
      ],
    }));

    it('Should not inject providers', () => {
      expect(() => TestBed.get(PLATFORM_GLOBAL_CONTEXT)).toThrow();
    });
  });
});
