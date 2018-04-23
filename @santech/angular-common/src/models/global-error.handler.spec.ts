import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Logger } from '@santech/common';
import { spyLogger } from '@santech/common/testing';
import { SantechCommonModule } from '..';
import { GlobalErrorHandler } from './global-error.handler';

describe('GlobalErrorHandler', () => {
  let handler: ErrorHandler;

  describe('When CustomErrorHandler is not provided', () => {

    beforeEach(() => handler = TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot(),
      ],
      providers: [
        { provide: Logger, useValue: spyLogger },
      ],
    }).get(ErrorHandler));

    it('Should be instance of GlobalErrorHandler', () => {
      expect(handler instanceof GlobalErrorHandler).toBe(true);
    });

    it('Should send error on the backend', () => {
      const error = new Error('OMFG');
      try {
        handler.handleError(error);
      } catch {
        expect(spyLogger.log).toHaveBeenCalledWith({
          attributes: jasmine.any(Object),
          logLevel: 'ERROR',
          message: 'OMFG',
          timestamp: jasmine.any(String),
        });
      }
    });
  });

  describe('When CustomErrorHandler is provided', () => {
    const customErrorHandler: ErrorHandler = {
      handleError: jest.fn(),
    };

    beforeEach(() => handler = TestBed.configureTestingModule({
      imports: [
        SantechCommonModule.forRoot({
          errorHandlerProvider: {
            provide: ErrorHandler,
            useValue: customErrorHandler,
          },
        }),
      ],
      providers: [
        { provide: Logger, useValue: spyLogger },
      ],
    }).get(ErrorHandler));

    it('Should use it', () => {
      expect(handler).toEqual(customErrorHandler);
    });
  });
});
