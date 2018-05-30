import { Inject, Injectable } from '@angular/core';
import { WebSocketClient } from '@santech/websocket';
import { ISubscribedTopic, ITopicSubscription } from '../interfaces/websocket';
import { WS_TOPICS } from '../tokens/ws-topics.token';

@Injectable()
export class WebSocketService {
  private _client: WebSocketClient;
  private _topics: Array<() => ITopicSubscription | Promise<ITopicSubscription>>;

  constructor(client: WebSocketClient, @Inject(WS_TOPICS) topics: any) {
    this._client = client;
    this._topics = topics;
  }

  public async subscribeToTopics(): Promise<ISubscribedTopic[]> {
    const client = this._client;
    await client.waitForConnection;
    const topics = await Promise.all(this._topics
      .map((topicOrProm) => Promise.resolve(topicOrProm())));
    return topics
      .map((topic) => ({
        ...topic,
        unsubscribe: client
          .setTopic(topic.path)
          .subscribe(topic.cb, topic.ackHeaders)
          .unsubscribe,
      }));
  }

  public unsubscribeTopics(): Promise<void> {
    return this._client.disconnect();
  }
}
