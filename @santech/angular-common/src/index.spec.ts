import { inject, TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import {
  Authenticator,
  AuthorizationInterceptor,
  HttpStatusInterceptor,
  IAuthenticatorEndPoints,
  ILogggerEndPoints,
  SessionInterceptor,
} from '@santech/common';
import { Http, IHttpInterceptor, Jwt, TokenStorage } from '@santech/core';
import { SantechCommonModule } from './';
import { IAppInformation } from './interfaces/app-information';
import { APP_INFORMATION } from './tokens/app-information.token';
import { CONFIG_END_POINTS } from './tokens/config-end-points.token';
import { END_POINTS } from './tokens/end-points.token';
import { CUSTOM_INTERCEPTORS } from './tokens/interceptors.token';

const endPoint = 'http://host:port';
const wsEndPoint = 'ws://host:port';

describe('SantechCommonModule', () => {
  describe('When imported in another module', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechCommonModule.forRoot({
          appInformationProvider: {
            provide: APP_INFORMATION,
            useValue: {
              name: 'AppName',
              version: 'AppVersion',
            },
          },
          endPointsProvider: {
            provide: CONFIG_END_POINTS,
            useValue: { endPoint, wsEndPoint },
          },
        }),
        SantechPlatformModule.forRoot(),
      ],
    }));

    it('Should provide santech studio common objects', inject(
      [Http, Jwt, TokenStorage, Authenticator],
      (http: Http, jwt: Jwt, tokenstorage: TokenStorage, auth: Authenticator) => {
        expect(http instanceof Http).toBeTruthy();
        expect(jwt instanceof Jwt).toBeTruthy();
        expect(tokenstorage instanceof TokenStorage).toBeTruthy();
        expect(auth instanceof Authenticator).toBeTruthy();
      }));

    it('Should provide endpoints', inject([END_POINTS], (endPoints: IAuthenticatorEndPoints & ILogggerEndPoints) => {
      expect(endPoints.authenticateEndPoint).toBe(`${endPoint}/publicapi/authenticate`);
      expect(endPoints.logEndPoint).toBe(`${endPoint}/api/logs`);
      expect(endPoints.endPoint).toBe(`${endPoint}/api`);
      expect(endPoints.publicEndPoint).toBe(`${endPoint}/publicapi`);
      expect(endPoints.renewEndPoint).toBe(`${endPoint}/api/renew`);
      expect(endPoints.wsEndPoint).toBe(`${wsEndPoint}`);
      expect(endPoints.zuulEndPoint).toBe(`${endPoint}/zuul/api`);
    }));

    it('Should know about your app name & version', inject([APP_INFORMATION], (infos: IAppInformation) => {
      expect(infos).toEqual({
        name: 'AppName',
        version: 'AppVersion',
      });
    }));

    it('Should provide custom interceptors in certain order', inject(
      [CUSTOM_INTERCEPTORS, SessionInterceptor, AuthorizationInterceptor, HttpStatusInterceptor],
      (customInterceptors: IHttpInterceptor[], ...ctors: IHttpInterceptor[]) => {
        customInterceptors.forEach((interceptor, i) => expect(interceptor).toBe(ctors[i]));
      }));
  });

  describe('When imported in a child module', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechCommonModule.forChild(),
        SantechPlatformModule.forRoot(),
      ],
    }));

    it('Should not inject providers', () => {
      expect(() => TestBed.get(Jwt)).toThrow();
    });
  });
});
