import { Authenticator } from '@santech/common';
import StompJs = require('@stomp/stompjs');
import sinon = require('sinon');
import SockJs = require('sockjs-client');
import { WebSocketClient, webSocketClientFactory } from './websocket';

const sockConnection = 'http://host:9090';
const wsConnection = 'ws://host:9090';
const wssConnection = 'wss://host:9090';
const topicEndpoint = 'topic/endpoint';

interface IStompStub {
  over: sinon.SinonStub;
  client: sinon.SinonStub;
}

interface IStompClientStub {
  connected: boolean;
  connect: sinon.SinonStub;
  disconnect: sinon.SinonStub;
  subscribe: sinon.SinonStub;
  heartbeat?: {
    outgoing?: number;
    incoming?: number;
  };
  debug(): void;
}

let clientStompStub: IStompClientStub;
let sockJsStub: sinon.SinonStub & typeof SockJs;
let stompStub: IStompStub & typeof StompJs;

const sockConfig = {
  connectionString: sockConnection,
};

const wsConfig = {
  connectionString: wsConnection,
};

const wssConfig = {
  connectionString: wssConnection,
};

/* tslint:disable:no-object-literal-type-assertion */
const auth = {
  getAuthorizationHeader: () => {
    return 'Bearer token';
  },
} as Authenticator;
/* tslint:enable:no-object-literal-type-assertion */

describe('WebSocketClient', () => {
  let client: WebSocketClient;

  beforeEach(() => {
    clientStompStub = Object.create({
      connect: sinon.stub(),
      debug: console.info,
      disconnect: sinon.stub(),
      subscribe: sinon.stub(),
    });
    clientStompStub.connect
      .callsFake(() => clientStompStub.connected = true)
      .callsArgAsync(1);

    sockJsStub = sinon.stub() as sinon.SinonStub & typeof SockJs;

    stompStub = {
      client: sinon.stub(),
      over: sinon.stub(),
    } as any as IStompStub & typeof StompJs;
    stompStub.over.returns(clientStompStub);
    stompStub.client.returns(clientStompStub);
  });

  describe('When using SockJs', () => {
    beforeEach(() => {
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, sockConfig);
      return client.connect();
    });

    it('Should create a client with sockJs', () => {
      expect(sockJsStub.calledWith(sockConfig.connectionString)).toBe(true);
      expect(stompStub.over.called).toBe(true);
    });
  });

  describe('When using WS', () => {
    beforeEach(() => {
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wssConfig);
      return client.connect();
    });

    it('Should create a WS client', () => {
      expect(stompStub.client.calledWith(wssConfig.connectionString)).toBe(true);
    });
  });

  describe('When not setting heartbeats', () => {
    beforeEach(() => {
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);
      return client.connect();
    });

    it('Should set default values', () => {
      if (clientStompStub.heartbeat) {
        expect(clientStompStub.heartbeat.outgoing).toEqual(20000);
        expect(clientStompStub.heartbeat.incoming).toEqual(0);
      } else {
        throw new Error('Default values not set');
      }
    });
  });

  describe('When setting heartbeats', () => {
    beforeEach(() => {
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, {
          heartbeats: {
            incoming: 10000,
            outgoing: 0,
          },
          ...wsConfig,
        });
      return client.connect();
    });

    it('Should set values', () => {
      if (clientStompStub.heartbeat) {
        expect(clientStompStub.heartbeat.outgoing).toEqual(0);
        expect(clientStompStub.heartbeat.incoming).toEqual(10000);
      } else {
        throw new Error('Values not set');
      }
    });
  });

  describe('When not debugging', () => {
    beforeEach(() => {
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);
      return client.connect();
    });

    it('Should override the client debugging method', () => {
      expect((client as any)._client.debug).toBeNull();
    });
  });

  describe('When debugging', () => {
    beforeEach(() => {
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, {
          debug: true, ...wsConfig,
        });
      return client.connect();
    });

    it('Should keep the client debugging method', () => {
      expect((client as any)._client.debug).toEqual(console.info);
    });
  });

  describe('When connection succeed', () => {
    beforeEach(() => {
      clientStompStub.connect.callsArg(1);
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);
      return client.connect();
    });

    it('Should not throw', async () => {
      try {
        await client.waitForConnection;
      } catch {
        throw new Error('Connection Failed');
      }
    });
  });

  describe('When connection fails', () => {
    beforeEach(() => {
      clientStompStub.connect.callsArg(2);
      return client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);
    });

    it('Should not throw', async () => {
      try {
        await client.connect();
        throw new Error('Connection Succeed');
      } catch (e) {
        expect(clientStompStub.connect.calledOnce).toBe(true);
      }
    });
  });

  describe('When disconnecting', () => {
    beforeEach(async () => {
      clientStompStub.disconnect.callsArg(0);
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);

      await client.connect();

      return client.disconnect();
    });

    it('Should disconnect client', () => {
      expect(clientStompStub.disconnect.calledOnce).toBe(true);
    });
  });

  describe('When client is already disconnected', () => {
    beforeEach(async () => {
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);
      await client.connect();
      // This simulates loss of connection
      clientStompStub.connected = false;
    });

    it('Should not call the disconnect as the callback will never fire', async () => {
      await client.disconnect();
      expect(clientStompStub.disconnect.called).toBe(false);
    });
  });

  describe('When disconnecting fails', () => {
    beforeEach(() => {
      clientStompStub.disconnect.throws(new Error('LOL'));
      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);
      return client.connect();
    });

    it('Should pass the error', async () => {
      try {
        await client.disconnect();
      } catch (e) {
        expect(e.message).toEqual('LOL');
      }
    });
  });

  describe('When setting a topic And subscribing to it', () => {
    const subscriptionSpy = sinon.spy();
    const unSubscriptionSpy = sinon.spy();
    let subscription: { unsubscribe(): void };

    beforeEach(async () => {
      clientStompStub.subscribe
        .callsArgWithAsync(1, { body: 'message' })
        .returns({
          unsubscribe: unSubscriptionSpy,
        });

      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);

      await client.connect();

      subscription = client
        .setTopic(topicEndpoint)
        .subscribe(subscriptionSpy);
    });

    it('Should callback with each message', (done) => {
      setTimeout(() => {
        expect(subscriptionSpy.calledWith('message')).toBe(true);
        done();
      });
    });

    describe('And unsubscribing', () => {
      beforeEach(() => subscription.unsubscribe());

      it('Should unsubscribe the stomp client subscription', () => {
        expect(unSubscriptionSpy.called).toBe(true);
      });
    });
  });

  describe('When setting a topic And subscribing to it with custom ack and nack', () => {
    const subscriptionStub = sinon.stub();
    const ackSpy = sinon.spy();
    const nackSpy = sinon.spy();

    beforeEach(() => {
      clientStompStub.subscribe
        .callsArgWithAsync(1, { body: 'message', ack: ackSpy, nack: nackSpy })
        .returns({
          unsubscribe: sinon.stub(),
        });
    });

    it('Should let the client call ack', async (done) => {
      subscriptionStub
        .callsArgWith(2, 'ACK');

      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);

      await client.connect();

      client
        .setTopic(topicEndpoint)
        .subscribe(subscriptionStub, { ack: 'client', nack: 'client' });
      setTimeout(() => {
        expect(ackSpy.calledWith('ACK')).toBe(true);
        done();
      });
    });

    it('Should let the client call nack', async (done) => {
      subscriptionStub
        .callsArgWith(3, 'NACK');

      client = webSocketClientFactory
        .create(auth, stompStub, sockJsStub, wsConfig);

      await client.connect();

      client
        .setTopic(topicEndpoint)
        .subscribe(subscriptionStub, { ack: 'client', nack: 'client' });
      setTimeout(() => {
        expect(nackSpy.calledWith('NACK')).toBe(true);
        done();
      });
    });
  });
});
