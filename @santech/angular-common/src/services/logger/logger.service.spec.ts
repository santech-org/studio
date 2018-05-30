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
    it('Should call the backend', async () => {
      const error = new Error('Houston, We Have a Problem!');
      const ok = await service.error(error);
      expect(ok).toBe(true);
    });
  });

  describe('And warn', () => {
    it('Should call the backend', async () => {
      const ok = await service.warning('warning');
      expect(ok).toBe(true);
    });
  });

  describe('And info', () => {
    it('Should call the backend', async () => {
      const ok = await service.info('info');
      expect(ok).toBe(true);
    });
  });
});
