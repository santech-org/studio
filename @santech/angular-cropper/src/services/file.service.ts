import { Injectable } from '@angular/core';
import { IFileProcess } from '../interfaces/images';

@Injectable()
export class FileService {
  public readFile(file: File) {
    const reader = new FileReader();
    const fileProcess: IFileProcess = {
      promise: new Promise<string>((res, rej) => {
        reader.onloadend = () => res(reader.result);
        reader.onerror = () => rej(reader.error);
        reader.readAsDataURL(file);
      }),
      reader,
    };
    return fileProcess.promise;
  }
}
