import { Inject, Injectable } from '@angular/core';
import { PLATFORM_FILE, PLATFORM_FILE_READER } from '@santech/angular-platform';

@Injectable()
export class FileService {
  private _newFile: (
    parts: Array<string | Blob | ArrayBuffer | ArrayBufferView>,
    filename: string,
    properties?: FilePropertyBag,
  ) => File;
  private _newFileReader: () => FileReader;

  constructor(
    @Inject(PLATFORM_FILE) fileCtor: any,
    @Inject(PLATFORM_FILE_READER) fileReaderCtor: any,
  ) {
    this._newFile = this._setFileCtor(fileCtor || File);
    this._newFileReader = this._setFileReaderCtor(fileReaderCtor || FileReader);
  }

  public readImageFile(file: File) {
    const reader = this._newFileReader();
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
    return this._newFile(parts, filename, properties);
  }

  private _setFileCtor(fileCtor: typeof File) {
    return (
      parts: Array<string | Blob | ArrayBuffer | ArrayBufferView>,
      filename: string,
      properties?: FilePropertyBag,
    ) => new fileCtor(parts, filename, properties);
  }

  private _setFileReaderCtor(fileReaderCtor: typeof FileReader) {
    return () => new fileReaderCtor();
  }
}
