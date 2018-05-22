import { ErrorHandler, Inject, ModuleWithProviders, NgModule } from '@angular/core';
import {
  PLATFORM_ATOB,
  PLATFORM_FETCH,
  PLATFORM_HEADERS,
  PLATFORM_STORAGE,
  SantechPlatformModule,
} from '@santech/angular-platform';
import {
  Authenticator,
  AuthorizationInterceptor,
  HttpErrorInterceptor,
  HttpStatusInterceptor,
  Logger,
  SessionInterceptor,
} from '@santech/common';
import {
  Base64Deserializer,
  FormDataRequestInterceptor,
  Http,
  identity,
  IHttpInterceptor,
  ImageDeserializer,
  JsonDeserializer,
  JsonRequestInterceptor,
  Jwt,
  TextPlainDeserializer,
  TokenStorage,
} from '@santech/core';
import { TimerComponent } from './components/timer/timer.component';
import { AddHeaderVersionDirective } from './directives/add-header-version.directive';
import { KeyboardSubmitDirective } from './directives/keyboard-submit.directive';
import { ISantechCommonModuleConfiguration } from './interfaces/configuration';
import { endpointsFactory } from './models/end-points.factory';
import { GlobalErrorHandler } from './models/global-error.handler';
import { httpFactory } from './models/http.factory';
import { LoggerService } from './services/logger/logger.service';
import { TimeoutService } from './services/timeout/timeout.service';
import { APP_INFORMATION } from './tokens/app-information.token';
import { CONFIG_END_POINTS } from './tokens/config-end-points.token';
import { DESERIALIZERS } from './tokens/deserializers.token';
import { END_POINTS } from './tokens/end-points.token';
import { CUSTOM_INTERCEPTORS, INTERCEPTORS } from './tokens/interceptors.token';

export * from './components/timer/timer.component';
export * from './directives/add-header-version.directive';
export * from './directives/keyboard-submit.directive';
export * from './interfaces/app-information';
export * from './interfaces/configuration';
export * from './interfaces/end-points';
export * from './models/global-error.handler';
export * from './services/timeout/timeout.service';
export * from './services/logger/logger.service';
export * from './tokens/app-information.token';
export * from './tokens/config-end-points.token';
export * from './tokens/deserializers.token';
export * from './tokens/end-points.token';
export * from './tokens/interceptors.token';

@NgModule({
  declarations: [
    TimerComponent,
    AddHeaderVersionDirective,
    KeyboardSubmitDirective,
  ],
  exports: [
    TimerComponent,
    AddHeaderVersionDirective,
    KeyboardSubmitDirective,
  ],
  imports: [
    SantechPlatformModule.forChild(),
  ],
})
export class SantechCommonModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechCommonModule,
    };
  }

  public static forRoot(config: ISantechCommonModuleConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: SantechCommonModule,
      providers: [
        { provide: DESERIALIZERS, useClass: JsonDeserializer, multi: true },
        { provide: DESERIALIZERS, useClass: ImageDeserializer, multi: true },
        { provide: DESERIALIZERS, useClass: Base64Deserializer, multi: true },
        { provide: DESERIALIZERS, useClass: TextPlainDeserializer, multi: true },
        { provide: INTERCEPTORS, useClass: JsonRequestInterceptor, multi: true },
        { provide: INTERCEPTORS, useClass: FormDataRequestInterceptor, multi: true },
        { provide: INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        { provide: CUSTOM_INTERCEPTORS, useFactory: identity, deps: [SessionInterceptor], multi: true },
        { provide: CUSTOM_INTERCEPTORS, useFactory: identity, deps: [AuthorizationInterceptor], multi: true },
        { provide: CUSTOM_INTERCEPTORS, useFactory: identity, deps: [HttpStatusInterceptor], multi: true },
        {
          deps: [PLATFORM_FETCH, DESERIALIZERS, PLATFORM_HEADERS, INTERCEPTORS],
          provide: Http,
          useFactory: httpFactory,
        },
        {
          deps: [PLATFORM_ATOB],
          provide: Jwt,
          useClass: Jwt,
        },
        {
          deps: [PLATFORM_STORAGE],
          provide: TokenStorage,
          useClass: TokenStorage,
        },
        {
          deps: [Http, TokenStorage, Jwt, END_POINTS],
          provide: Authenticator,
          useClass: Authenticator,
        },
        {
          deps: [Http, END_POINTS],
          provide: Logger,
          useClass: Logger,
        },
        {
          deps: [CONFIG_END_POINTS],
          provide: END_POINTS,
          useFactory: endpointsFactory,
        },
        {
          deps: [Authenticator, END_POINTS],
          provide: HttpStatusInterceptor,
          useClass: HttpStatusInterceptor,
        },
        {
          deps: [Authenticator, END_POINTS],
          provide: SessionInterceptor,
          useClass: SessionInterceptor,
        },
        {
          deps: [Authenticator, END_POINTS],
          provide: AuthorizationInterceptor,
          useClass: AuthorizationInterceptor,
        },
        LoggerService,
        TimeoutService,
        config.appInformationProvider
          ? config.appInformationProvider
          : {
            provide: APP_INFORMATION,
            useValue: {
              name: 'NOT SET',
              version: 'NOT SET',
            },
          },
        config.endPointsProvider
          ? config.endPointsProvider
          : {
            provide: CONFIG_END_POINTS,
            useValue: {
              endPoint: '',
              wsEndPoint: '',
            },
          },
        config.errorHandlerProvider
          ? config.errorHandlerProvider
          : {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler,
          },
      ],
    };
  }

  constructor(http: Http, @Inject(CUSTOM_INTERCEPTORS) interceptors: IHttpInterceptor[]) {
    interceptors.forEach((i) => http.addInterceptor(i));
  }
}
