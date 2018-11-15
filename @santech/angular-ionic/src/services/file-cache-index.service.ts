import { Inject, Injectable } from '@angular/core';
import { FileEntry, Metadata } from '@ionic-native/file/ngx';
import { ICacheConfig, IIndexItem } from '../interfaces/cache';
import { CACHE_CONFIG } from '../tokens/cache-config.token';
import { LocalFileService } from './local-file.service';

@Injectable()
export class FileCacheIndexService {
  private _alreadyCached: { [index: string]: string } = {};
  private _cacheIndex: IIndexItem[] = [];
  private _currentCacheSize: number = 0;
  private _indexed: boolean = false;

  private _config: ICacheConfig;
  private _file: LocalFileService;

  constructor(
    fileService: LocalFileService,
    @Inject(CACHE_CONFIG) config: ICacheConfig,
  ) {
    this._file = fileService;
    this._config = config;
  }

  get isCacheSpaceExceeded(): boolean {
    const { maxSize } = this._config;
    return maxSize > -1 && this._currentCacheSize > maxSize;
  }

  public async init(replaceDirectory: boolean = false): Promise<void> {
    const file = this._file;
    const directory = this._config.directory;
    this._cacheIndex = [];

    await file.createDirectory(directory, replaceDirectory);

    const files = await file.listDirectory(directory);

    await Promise.all(files.map(this._loadIndexFromCache.bind(this)));

    // Sort items by date. Most oldest to most recent.
    this._cacheIndex = this._cacheIndex.sort((a, b) => (a.modificationTime > b.modificationTime ? 1 : -1));

    this._indexed = true;
  }

  public async addFile(filename: string, data: string): Promise<string> {
    if (this.isCacheSpaceExceeded) {
      await this._maintainCacheSize();
    }

    const cachedFile = this._alreadyCached[filename];
    if (cachedFile) {
      return cachedFile;
    }

    const file = this._file;

    const fileEntry = await file.createFile(this._config.directory, filename, data, true);
    const metadata = await file.getMetadata(fileEntry);

    this._addFileToIndex(metadata);
    this._maintainCacheSize();

    return this._alreadyCached[filename] = data;
  }

  public async getFile(filename: string): Promise<string> {
    const cachedFile = this._alreadyCached[filename];
    if (cachedFile) {
      return cachedFile;
    }

    const file = await this._file.getFile(this._config.directory, filename);
    return this._alreadyCached[filename] = file;
  }

  public async deleteFile(filename: string) {
    await this._file.removeFile(this._config.directory, filename);
    this.init();
  }

  public async clear() {
    await this._file.removeRecursively(this._config.directory);
    this.init(true);
  }

  private _maintainCacheSize() {
    if (this._config.maxSize > -1 && this._indexed) {
      return this._maintain();
    }
  }

  private async _maintain() {
    const {
      directory,
      maxSize,
    } = this._config;

    if (this._currentCacheSize <= maxSize) {
      return;
    }

    // grab the first item in index since it's the oldest one
    const [file] = this._cacheIndex.splice(0, 1);

    if (!file) {
      return;
    }

    // delete the file then process next file if necessary
    await this._file.removeFile(directory, file.name);
    this._currentCacheSize -= file.size;
    this._maintain();
  }

  private async _loadIndexFromCache(fileEntry: FileEntry): Promise<void> {
    const {
      directory,
      maxAge,
    } = this._config;

    const metadata = await this._file.getMetadata(fileEntry);

    const {
      modificationTime,
    } = metadata;
    const {
      name,
    } = fileEntry;

    if (maxAge > -1 && Date.now() - modificationTime.getTime() > maxAge) {
      await this._file.removeFile(directory, name);
      return;
    }

    this._addFileToIndex(metadata);
  }

  private _addFileToIndex({ modificationTime, size }: Metadata) {
    this._currentCacheSize += size;
    this._cacheIndex.push({
      modificationTime,
      name,
      size,
    });
  }
}
