import { analytics } from '@santech/analytics-core';
import { spyHttp } from '@santech/core/testing';
import { SantechIntegration } from './integration';

const publicEndPoint = '/publicapi';

describe('Santech analytics Integration', () => {
  let integration: SantechIntegration;

  beforeEach(() => {
    integration = new SantechIntegration(spyHttp as any, { publicEndPoint }, {
      context: {
        client: {
          name: 'name',
          version: 'version',
        },
      },
    });
    analytics.add(integration);
    analytics.init();
  });

  it('Should be loaded', () => {
    expect(integration.loaded()).toBe(true);
  });

  describe('When analytics invoke', () => {
    beforeEach(() => analytics.page());

    it('Should post dto', () => {
      expect(spyHttp.post).toHaveBeenCalledWith('/publicapi/segment', {
        anonymousId: jasmine.any(String),
        context: {
          client: {
            name: 'name',
            version: 'version',
          },
          page: {
            path: 'blank',
            referrer: '',
            search: '',
            title: '',
            url: 'about:blank',
          },
        },
        integrations: {},
        properties: {
          path: 'blank',
          referrer: '',
          search: '',
          title: '',
          url: 'about:blank',
        },
        timestamp: jasmine.any(Date),
        type: 'page',
        userId: null,
      });
    });
  });
});
