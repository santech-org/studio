import sinon = require('sinon');
import { TokenStorage } from './storage';

export const token = 'clmqsdkjflsdkhfoqjidsgfvpçGH';

export const authKey = 'std-authenticationToken';

export const deviceKey = 'std-deviceToken';

export const localStorageStub = {
  clear: sinon.stub(),
  getItem: sinon.stub(),
  key: sinon.stub(),
  length: 0,
  removeItem: sinon.stub(),
  setItem: sinon.stub(),
};

describe('TokenStorage', () => {
  let storage: TokenStorage;

  beforeEach(() => {
    localStorageStub.getItem.reset();
    localStorageStub.setItem.reset();
    localStorageStub.removeItem.reset();
    localStorageStub.clear.reset();
    localStorageStub.key.reset();
    storage = new TokenStorage(localStorageStub, { authKey, deviceKey });
  });

  describe('When I get the token without being logged', () => {
    it('Should throw', () => {
      expect(() => storage.getJwt()).toThrow('Not logged in');
    });
  });

  describe('When I get the device token without being logged', () => {
    it('Should throw', () => {
      expect(() => storage.getDeviceToken()).toThrow('No device token');
    });
  });

  describe('When I get the token logged in', () => {
    beforeEach(() => localStorageStub.getItem.returns(token));

    it('Should return the token', () => {
      expect(storage.getJwt()).toEqual(token);
    });
  });

  describe('When I get the device token logged in', () => {
    beforeEach(() => localStorageStub.getItem.returns(token));

    it('Should return the token', () => {
      expect(storage.getDeviceToken()).toEqual(token);
    });
  });

  describe('When I set the token', () => {
    beforeEach(() => storage.setJwt(token));

    it('Should set it in the localStorage', () => {
      expect(localStorageStub.setItem.calledWith(authKey, token)).toBe(true);
    });
  });

  describe('When I set the device token', () => {
    beforeEach(() => storage.setDeviceToken(token));

    it('Should set it in the localStorage', () => {
      expect(localStorageStub.setItem.calledWith(deviceKey, token)).toBe(true);
    });
  });

  describe('When I remove the token', () => {
    beforeEach(() => storage.removeJwt());

    it('Should set it in the localStorage', () => {
      expect(localStorageStub.removeItem.calledWith(authKey)).toBe(true);
    });
  });

  describe('When I remove the device token', () => {
    beforeEach(() => storage.removeDeviceToken());

    it('Should set it in the localStorage', () => {
      expect(localStorageStub.removeItem.calledWith(deviceKey)).toBe(true);
    });
  });

  describe('When I set an other browser storage', () => {
    const sessionStorageStub = {
      getItem: sinon.stub(),
    };

    beforeEach(() => storage.useOtherBrowserStorage(sessionStorageStub as any as Storage));

    describe('And I get the token logged in', () => {
      beforeEach(() => sessionStorageStub.getItem.returns(token));

      it('Should return the token', () => {
        expect(storage.getJwt()).toEqual(token);
      });
    });
  });

  describe('When I use a different auth key', () => {
    beforeEach(() => {
      localStorageStub.getItem.returns(token);
      storage.useDifferentKey('other-key');
    });

    it('Should use it', () => {
      storage.getJwt();
      expect(localStorageStub.getItem.calledWith('other-key')).toBe(true);
    });

    describe('And I reset keys', () => {
      beforeEach(() => storage.resetKeys());

      it('Should not use it anymore', () => {
        storage.getJwt();
        expect(localStorageStub.getItem.calledWith('other-key')).toBe(false);
      });
    });
  });

  describe('When I use a different auth key and device key', () => {
    beforeEach(() => {
      localStorageStub.getItem.returns(token);
      storage.useDifferentKey('other-key', 'device-key');
    });

    it('Should use it', () => {
      storage.setJwt(token);
      storage.setDeviceToken(token);
      storage.getJwt();
      storage.getDeviceToken();
      expect(localStorageStub.setItem.calledWith('other-key', token)).toBe(true);
      expect(localStorageStub.setItem.calledWith('device-key', token)).toBe(true);
      expect(localStorageStub.getItem.calledWith('other-key')).toBe(true);
      expect(localStorageStub.getItem.calledWith('device-key')).toBe(true);
    });

    describe('And I reset keys', () => {
      beforeEach(() => storage.resetKeys());

      it('Should not use it anymore', () => {
        storage.getJwt();
        storage.getDeviceToken();
        expect(localStorageStub.getItem.calledWith('other-key')).toBe(false);
        expect(localStorageStub.getItem.calledWith('device-key')).toBe(false);
      });
    });
  });

  describe('When I set an item', () => {
    beforeEach(() => {
      localStorageStub.setItem.withArgs('key', 'item')
        .callsFake(() => localStorageStub.getItem.returns('item'));
      storage.setItem('key', 'item');
    });

    it('Should store it', () => {
      expect(storage.getItem('key')).toEqual('item');
    });

    describe('And I remove it', () => {
      beforeEach(() => {
        localStorageStub.removeItem.withArgs('key')
          .callsFake(() => localStorageStub.getItem.returns(null));
        storage.removeItem('key');
      });

      it('Should throw about missing item', () => {
        expect(() => storage.getItem('key')).toThrow('No item for key key');
      });
    });
  });
});
