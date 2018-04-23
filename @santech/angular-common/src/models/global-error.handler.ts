import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private _loggerService: LoggerService;
  constructor(loggerService: LoggerService) {
    this._loggerService = loggerService;
  }

  public handleError(error: Error): never {
    this._loggerService.error(error);
    throw error;
  }
}
