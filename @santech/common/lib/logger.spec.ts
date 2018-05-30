import { Http } from '@santech/core';
import { success } from '@santech/core/testing';
import sinon = require('sinon');
import { Logger } from './logger';
import { ILogDto } from './models';

const logEndPoint = 'url/to/logger/api/log';

let httpStub: sinon.SinonStubbedInstance<Http> & Http;

describe('Logger', () => {
  let service: Logger;

  beforeEach(() => httpStub = sinon.createStubInstance(Http) as sinon.SinonStubbedInstance<Http> & Http);

  beforeEach(() => service = new Logger(httpStub, { logEndPoint }));

  describe('When log', () => {
    const log: ILogDto = {
      logLevel: 'ERROR',
      message: 'The service log failed',
      timestamp: (new Date()).toISOString(),
    };

    beforeEach(() => {
      httpStub.post
        .withArgs(logEndPoint, log)
        .returns(Promise.resolve(success({ ok: true })));
      return;
    });

    it('Should post the log', async () => {
      const ok = await service.log(log);
      expect(ok).toBe(true);
    });
  });
});
