import { TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Logger } from '@santech/common';
import { spyLogger } from '@santech/common/testing';
import { SantechCommonModule } from '../..';
import { LoggerService } from '../../services/logger/logger.service';
import { CONFIG_END_POINTS } from '../../tokens/config-end-points.token';

const endPoint = 'santech/endpoint';

describe('Logger Service', () => {
  let service: LoggerService;

  beforeEach(() => {
    spyLogger.log.mockImplementationOnce(() => Promise.resolve(true));

    service = TestBed.configureTestingModule({
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot({
          endPointsProvider: {
            provide: CONFIG_END_POINTS,
            useValue: { endPoint },
          },
        }),
      ],
      providers: [
        {
          provide: Logger,
          useValue: spyLogger,
        },
      ],
    }).get(LoggerService);
  });

  describe('And log error', () => {
    it('Should call the backend', () => {
      const error = new Error('Houston, We Have a Problem!');
      service.error(error).then((ok) => expect(ok).toBe(true));
    });
  });

  describe('And warn', () => {
    it('Should call the backend', () => {
      service.warning('warning').then((ok) => expect(ok).toBe(true));
    });
  });

  describe('And info', () => {
    it('Should call the backend', () => {
      service.info('info').then((ok) => expect(ok).toBe(true));
    });
  });
});
