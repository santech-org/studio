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
  public async log(log: ILogDto): Promise<boolean> {
    const resp = await this._http.post(this._endPoint, log);
    return resp.ok;
  }
}
