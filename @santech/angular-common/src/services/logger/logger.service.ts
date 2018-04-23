import { Inject, Injectable } from '@angular/core';
import { PLATFORM_NAVIGATOR } from '@santech/angular-platform';
import { Logger } from '@santech/common';
import { IAppInformation } from '../../interfaces/app-information';
import { APP_INFORMATION } from '../../tokens/app-information.token';

@Injectable()
export class LoggerService {
  private _appInformation: IAppInformation;
  private _logger: Logger;
  private _navigator: Navigator;

  constructor(
    logger: Logger,
    @Inject(APP_INFORMATION) appInformation: IAppInformation,
    // Leave any here because metadata can not resolve Navigator
    @Inject(PLATFORM_NAVIGATOR) navigator: any) {
    this._appInformation = appInformation;
    this._logger = logger;
    this._navigator = navigator;
  }

  public error(error: Error): Promise<boolean> {
    return this._logger.log({
      ... this._commonLog(),
      logLevel: 'ERROR',
      message: error.message,
    });
  }

  public warning(message: string): Promise<boolean> {
    return this._logger.log({
      ... this._commonLog(),
      logLevel: 'WARN',
      message,
    });
  }

  public info(message: string): Promise<boolean> {
    return this._logger.log({
      ... this._commonLog(),
      logLevel: 'INFO',
      message,
    });
  }

  private _commonLog() {
    const {
      name,
      version,
    } = this._appInformation;

    const userAgent = this._navigator.userAgent;

    return {
      attributes: {
        name,
        userAgent: userAgent ? userAgent : 'no user agent',
        version,
      },
      timestamp: (new Date()).toISOString(),
    };
  }
}
