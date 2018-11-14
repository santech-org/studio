import { async, TestBed } from '@angular/core/testing';
import { File as IonicFile, Metadata } from '@ionic-native/file';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { createJestSpyObj, filterPrivate } from '@santech/core/testing';
import { Platform } from 'ionic-angular';
import {
  cordovaPlatform,
  FileCacheIndexService,
  FileCacheService,
  LocalFileService,
  SantechIonicModule,
} from '..';
import { spyPlatform } from '../../testing/ionic';

describe('FileCache service tests', () => {
  let service: FileCacheService;
  const dataDirectory = 'dataDirectory/';
  let file: IonicFile;

  beforeEach(() => {
    jest.resetAllMocks();

    const cacheServiceMethods = Object
      .getOwnPropertyNames(IonicFile.prototype).filter(filterPrivate);
    file = createJestSpyObj(cacheServiceMethods);

    file.dataDirectory = dataDirectory;

    TestBed
      .configureTestingModule({
        imports: [
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechIonicModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
        providers: [
          FileCacheIndexService,
          FileCacheService,
          LocalFileService,
          { provide: Platform, useValue: spyPlatform },
          { provide: IonicFile, useValue: file },
        ],
      });

    service = TestBed.get(FileCacheService);
  });

  describe('On mobile', () => {
    beforeEach(() => {
      spyPlatform.ready.mockResolvedValue(cordovaPlatform);

      jest.spyOn(file, 'checkDir').mockRejectedValue(null);
      jest.spyOn(file, 'createDir').mockResolvedValueOnce(true);
      jest.spyOn(file, 'listDir').mockResolvedValue([]);

      jest.spyOn(file, 'writeFile').mockResolvedValue({
        getMetadata: (resolve: (m: Metadata) => void, _: () => Error) => resolve({
          modificationTime: new Date(),
          size: 0,
        }),
      });
    });

    describe('When create file', () => {
      const createFileContent = 'test-data';
      const createFileName = 'test-create';

      beforeEach(async () => {
        await service.createFile(createFileName, createFileContent);
      });

      it('Should index cache', async () => {
        expect(file.checkDir).toHaveBeenCalledWith(dataDirectory, 'cache');
        expect(file.createDir).toHaveBeenCalledWith(dataDirectory, 'cache', false);
      });

      it('Should create file', () => {
        expect(file.writeFile)
          .toHaveBeenCalledWith(`${dataDirectory}cache`, createFileName, createFileContent, { replace: true });
      });

      describe('And on next call', () => {
        beforeEach(async () => {
          jest.spyOn(file, 'checkDir').mockResolvedValue(true);
          await service.createFile(createFileName, createFileContent);
        });

        it('Should not init cache', () => {
          expect(file.createDir).toHaveBeenCalledTimes(1);
          expect(file.checkDir).toHaveBeenCalledTimes(1);
        });

        it('Should create file', () => {
          expect(file.writeFile)
            .toHaveBeenCalledWith(`${dataDirectory}cache`, createFileName, createFileContent, { replace: true });
        });
      });
    });

    describe('When has already been called', () => {
      beforeEach(async () => {
        const createFileContent = 'create-file-content';
        const createFileName = 'create-file';
        await service.createFile(createFileName, createFileContent);
      });

      describe('When get a file', () => {
        const getFileContent = 'get-file-content';
        const getFileName = 'get-file';

        beforeEach(() => {
          jest.spyOn(file, 'resolveLocalFilesystemUrl').mockResolvedValue(true);
          jest.spyOn(file, 'readAsText').mockResolvedValue(getFileContent);
        });

        it('Should resolve a promise', async () => {
          const content = await service.getFile(getFileName);
          expect(content).toEqual(getFileContent);
        });
      });

      describe('When clear file', () => {
        const deleteFileName = 'delete-file';

        it('Should resolve a promise', async () => {
          await service.deleteFile(deleteFileName);
          expect(file.removeFile).toHaveBeenCalledWith(`${dataDirectory}cache`, deleteFileName);
        });
      });

      describe('When clear all cache', () => {
        it('Should resolve a promise', async () => {
          await service.clear();
          expect(file.removeRecursively).toHaveBeenCalledWith(dataDirectory, 'cache');
        });
      });
    });
  });

  describe('On desktop', () => {
    beforeEach(async(() => {
      spyPlatform.ready.mockResolvedValue('desktop');
    }));

    describe('When create file', () => {
      it('Should resolve a promise', async (done) => {
        await service.createFile('test', 'test-data');
        done();
      });
    });

    describe('When get a file', () => {
      it('Should reject a promise', async (done) => {
        try {
          await service.getFile('test');
        } catch (_) {
          done();
        }
      });
    });

    describe('When clear file', () => {
      it('Should resolve a promise', async (done) => {
        await service.deleteFile('test');
        done();
      });
    });

    describe('When clear all cache', () => {
      it('Should resolve a promise', async (done) => {
        await service.clear();
        done();
      });
    });
  });
});
