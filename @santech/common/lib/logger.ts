import { Http } from '@santech/core';
import { ILogDto, ILogggerEndPoints } from './models';

/**
 * @description Use this class to log on API
 */
export class Logger {
  private _http: Http;
  private _endPoint: string;

  constructor(http: Http, endPoints: ILogggerEndPoints) {
    this._http = http;
    this._endPoint = endPoints.logEndPoint;
  }

  /**
   * @description Report log to back
   */
  public log(log: ILogDto): Promise<boolean> {
    return this._http.post(this._endPoint, log).then((resp) => resp.ok);
  }
}
