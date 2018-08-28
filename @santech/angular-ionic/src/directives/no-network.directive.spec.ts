import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed  } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
import { SantechAnalyticsModule } from '@santech/angular-analytics';
import { SantechCommonModule } from '@santech/angular-common';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Subject } from 'rxjs';
import { NETWORK_CONNECTION_DELAY, NoNetworkDirective, SantechIonicModule } from '..';
import { spyNetwork } from '../../testing/ionic';

@Component({
  selector: 'no-network',
  template: `<div no-network (onConnect)="connect($event)"
                             (onDisconnect)="disconnect($event)"></div>`,
})
class NoNetworkTestComponent {
  @ViewChild(NoNetworkDirective)
  // @ts-ignore
  public noNetwork: NoNetworkDirective;
  public connect = jest.fn();
  public disconnect = jest.fn();
}

describe('No network directive', () => {
  let fixture: ComponentFixture<NoNetworkTestComponent>;
  const connectSubject = new Subject();
  const disconnectSubject = new Subject();
  spyNetwork.onConnect.mockReturnValue(connectSubject);
  spyNetwork.onDisconnect.mockReturnValue(disconnectSubject);

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          NoNetworkTestComponent,
        ],
        imports: [
          SantechIonicModule.forRoot(),
          SantechAnalyticsModule.forRoot(),
          SantechCommonModule.forRoot(),
          SantechPlatformModule.forRoot(),
        ],
      })
      .overrideDirective(NoNetworkDirective, {
        set: {
          providers: [
            { provide: Network, useValue: spyNetwork },
            { provide: NETWORK_CONNECTION_DELAY, useValue: 0 },
          ],
        },
      });

    fixture = TestBed.createComponent(NoNetworkTestComponent);
    fixture.autoDetectChanges();
  });

  describe('On connect without disconnecting before', () => {
    beforeEach(async(() => connectSubject.next()));

    it('Should not call connect', () => {
      expect(fixture.componentInstance.connect).not.toHaveBeenCalled();
    });
  });

  describe('On disconnect', () => {
    beforeEach(async(() => disconnectSubject.next()));

    it('Should call disconnect', () => {
      expect(fixture.componentInstance.disconnect).toHaveBeenCalledTimes(1);
    });

    describe('And on connect', () => {
      beforeEach(async(() => connectSubject.next()));

      it('Should call connect', () => {
        expect(fixture.componentInstance.disconnect).toHaveBeenCalledTimes(1);
      });
    });
  });
});
