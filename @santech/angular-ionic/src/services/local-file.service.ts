import { Injectable } from '@angular/core';
import {
  DirectoryEntry,
  Entry,
  File,
  FileEntry,
  Metadata,
  RemoveResult,
} from '@ionic-native/file/ngx';

@Injectable()
export class LocalFileService {
  private _file: File;

  constructor(file: File) {
    this._file = file;
  }

  public createFile(path: string, fileName: string, data: string, replace: boolean): Promise<FileEntry> {
    return this._file.writeFile(this._getPath(path), fileName, data, { replace });
  }

  public async getFile(path: string, fileName: string) {
    const file = this._file;
    const localPath = this._getPath(path);
    const filePath = [localPath, fileName].join('/');

    await file.resolveLocalFilesystemUrl(filePath);
    return file.readAsText(localPath, fileName);
  }

  public removeFile(path: string, fileName: string): Promise<RemoveResult> {
    return this._file.removeFile(this._getPath(path), fileName);
  }

  public createDirectory(directoryName: string, replace: boolean): Promise<boolean | DirectoryEntry> {
    const file = this._file;
    const dataDirectory = file.dataDirectory;

    return replace
      ? file.createDir(dataDirectory, directoryName, replace)
      : file.checkDir(dataDirectory, directoryName)
        .catch(() => file.createDir(dataDirectory, directoryName, false));
  }

  public removeRecursively(directoryName: string): Promise<RemoveResult> {
    const file = this._file;
    return file.removeRecursively(file.dataDirectory, directoryName);
  }

  public listDirectory(directoryName: string): Promise<Entry[]> {
    const file = this._file;
    return file.listDir(file.dataDirectory, directoryName);
  }

  public getMetadata(fileEntry: FileEntry): Promise<Metadata> {
    return new Promise((resolve, reject) => fileEntry.getMetadata(resolve, reject));
  }

  private _getPath(path: string) {
    return [this._file.dataDirectory, path].join('');
  }
}
