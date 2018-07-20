import { Inject, Injectable } from '@angular/core';
import { PLATFORM_FILE, PLATFORM_FILE_READER } from '@santech/angular-platform';

@Injectable()
export class FileService {
  private _file: typeof File;
  private _fileReader: typeof FileReader;

  constructor(
    @Inject(PLATFORM_FILE) file: any,
    @Inject(PLATFORM_FILE_READER) fileReader: any,
  ) {
    this._file = file;
    this._fileReader = fileReader;
  }

  public readFile(file: File) {
    const fileReader = this._fileReader;
    const reader = new fileReader();
    return new Promise<string>((res, rej) => {
      reader.onloadend = () => res(reader.result);
      reader.onerror = () => rej(reader.error);
      reader.readAsDataURL(file);
    });
  }

  public createFile(
    parts: Array<string | Blob | ArrayBuffer | ArrayBufferView>,
    filename: string,
    properties?: FilePropertyBag,
  ) {
    const file = this._file;
    return new file(parts, filename, properties);
  }
}
