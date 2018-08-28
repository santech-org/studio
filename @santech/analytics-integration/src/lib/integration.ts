import { integration, ISegmentIntegrationStatic } from '@santech/analytics-core';
import { Http, IPublicEndPoints } from '@santech/core';

// tslint:disable-next-line:variable-name
export const Integration: ISegmentIntegrationStatic = integration('santech');

export class SantechIntegration extends Integration {
  private _endPoint: string;
  private _http: Http;

  constructor(http: Http, endPoints: IPublicEndPoints, options?: any) {
    super(options);
    this._http = http;
    this._endPoint = endPoints.publicEndPoint;
  }

  public initialize() {
    this.analytics.on('invoke', (msg: any) => {
      const dto = msg.json();
      const context = this.options.context || {};
      const properties = this.options.properties || {};
      dto.userId = dto.userId || this.analytics.user().id();
      dto.context = { ...context, ...dto.context };
      dto.properties = { ...properties, ...dto.properties };
      this._http.post(this._endPoint.concat('/segment'), dto);
      this.ready();
    });
  }

  public loaded() {
    return true;
  }
}
