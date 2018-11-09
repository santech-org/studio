import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { cordovaPlatform } from '../models/cordova';
import { FileCacheIndexService } from './file-cache-index.service';

@Injectable()
export class FileCacheService {
  private _isCordova: boolean | undefined;

  private _indexService: FileCacheIndexService;
  private _platform: Platform;

  constructor(
    indexService: FileCacheIndexService,
    platform: Platform,
  ) {
    this._indexService = indexService;
    this._platform = platform;
  }

  public async createFile(filename: string, data: string) {
    const isCordova = await this._init();

    if (isCordova) {
      return this._indexService.addFile(filename, data);
    }
  }

  public async getFile(filename: string): Promise<string> {
    const isCordova = await this._init();

    if (isCordova) {
      return this._indexService.getFile(filename);
    }

    throw new Error('FileCacheService(getFile): cordova is not available');
  }

  public async deleteFile(filename: string) {
    const isCordova = await this._init();

    if (isCordova) {
      return this._indexService.deleteFile(filename);
    }
  }

  public async clear() {
    const isCordova = await this._init();

    if (isCordova) {
      return this._indexService.clear();
    }
  }

  private async _init() {
    const isCordova = this._isCordova;

    if (typeof isCordova === 'boolean') {
      return isCordova;
    }

    const pt = await this._platform.ready();
    const is = pt === cordovaPlatform;

    if (is) {
      await this._indexService.init();
    }

    return this._isCordova = is;
  }
}
