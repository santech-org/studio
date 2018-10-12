import { Http } from '@santech/core';
import { ILogDto, ILoggerEndPoints } from './models';

/**
 * @description Use this class to log on API
 */
export class Logger {
  private _http: Http;
  private _endPoint: string;

  constructor(http: Http, endPoints: ILoggerEndPoints) {
    this._http = http;
    this._endPoint = endPoints.loggerEndPoint;
  }

  /**
   * @description Report log to back
   */
  public async log<T extends ILogDto>(log: T): Promise<boolean> {
    const resp = await this._http.post(this._endPoint, log);
    return resp.ok;
  }
}
