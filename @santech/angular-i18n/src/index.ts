import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PLATFORM_NAVIGATOR, SantechPlatformModule } from '@santech/angular-platform';
import { ISantechI18nModuleConfiguration } from './interfaces/configuration';
import { LocalesService } from './models/locales.service';
import { LocalesStore } from './models/locales.store';
import { navigatorLanguageFactory } from './models/navigator-language.factory';
import { LOCALES } from './tokens/locales.token';

export * from './interfaces/configuration';
export * from './interfaces/locales';
export * from './models/locales.service';
export * from './tokens/locales.token';

@NgModule({
  exports: [
    TranslateModule,
  ],
  imports: [
    TranslateModule.forChild(),
    SantechPlatformModule.forChild(),
  ],
})
export class SantechI18nModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechI18nModule,
    };
  }

  public static forRoot(config: ISantechI18nModuleConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: SantechI18nModule,
      providers: [
        LocalesService,
        LocalesStore,
        {
          deps: [PLATFORM_NAVIGATOR],
          provide: LOCALE_ID,
          useFactory: navigatorLanguageFactory,
        },
        config.localesProvider
          ? config.localesProvider
          : {
            provide: LOCALES,
            useValue: {},
          },
      ],
    };
  }
}
