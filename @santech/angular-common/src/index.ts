import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import {
  PLATFORM_ATOB,
  PLATFORM_FETCH,
  PLATFORM_HEADERS,
  PLATFORM_STORAGE,
  SantechPlatformModule,
} from '@santech/angular-platform';
import { Authenticator, HttpErrorInterceptor, Logger } from '@santech/common';
import { Http, Jwt, TokenStorage } from '@santech/core';
import { TimerComponent } from './components/timer/timer.component';
import { AddHeaderVersionDirective } from './directives/add-header-version.directive';
import { KeyboardSubmitDirective } from './directives/keyboard-submit.directive';
import { ISantechCommonModuleConfiguration } from './interfaces/configuration';
import { endpointsFactory } from './models/end-points.factory';
import { GlobalErrorHandler } from './models/global-error.handler';
import { httpErrorInterceptorFactory } from './models/http-error-interceptor.factory';
import { LoggerService } from './services/logger/logger.service';
import { TimeoutService } from './services/timeout/timeout.service';
import { APP_INFORMATION } from './tokens/app-information.token';
import { CONFIG_END_POINTS } from './tokens/config-end-points.token';
import { END_POINTS } from './tokens/end-points.token';

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
export * from './tokens/end-points.token';

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
        {
          deps: [PLATFORM_FETCH, PLATFORM_HEADERS],
          provide: Http,
          useClass: Http,
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
          deps: [Http, END_POINTS],
          provide: HttpErrorInterceptor,
          useFactory: httpErrorInterceptorFactory,
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
}
