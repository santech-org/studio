import { async, inject, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PLATFORM_NAVIGATOR, SantechPlatformModule } from '@santech/angular-platform';
import { SantechI18nModule } from './';
import { ILocaleStore } from './interfaces/locales';
import { LocalesService } from './models/locales.service';
import { LOCALES } from './tokens/locales.token';

const locales: ILocaleStore = {
  en: {
    foo: 'en bar',
  },
  fr: {
    foo: 'fr bar',
  },
};

describe('SantechI18nModule', () => {
  describe('When imported in another module', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechI18nModule.forRoot({
          localesProvider: {
            provide: LOCALES,
            useValue: locales,
          },
        }),
        TranslateModule.forRoot(),
        SantechPlatformModule.forRoot(),
      ],
    }));

    describe('And locales Service is initiated', () => {
      beforeEach(async(inject([LocalesService], (localesService: LocalesService) => localesService.init())));

      it('Should bootstrap store', inject([LocalesService], (localesService: LocalesService) => {
        expect(localesService.translate('foo')).toBe(locales[navigator.language.substr(0, 2)].foo);
      }));
    });

    describe('And I need to translate static labels', () => {
      beforeEach(async(inject([LocalesService], (localesService: LocalesService) => localesService.init(['foo']))));

      it('Should store static labels map', inject([LocalesService], (localesService: LocalesService) => {
        expect(localesService.getLabel('foo')).toBe(locales[navigator.language.substr(0, 2)].foo as string);
      }));
    });
  });

  describe('When imported in a child module', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechI18nModule,
        TranslateModule.forRoot(),
        SantechPlatformModule.forRoot(),
      ],
    }));

    it('Should not inject providers', () => {
      expect(() => TestBed.get(LocalesService)).toThrow();
    });
  });

  describe('When my browser is in french', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechI18nModule.forRoot({
          localesProvider: {
            provide: LOCALES,
            useValue: locales,
          },
        }),
        TranslateModule.forRoot(),
        SantechPlatformModule.forRoot(),
      ],
      providers: [
        { provide: PLATFORM_NAVIGATOR, useValue: { language: 'fr' } },
      ],
    }));

    describe('And locales Service is initiated', () => {
      beforeEach(async(inject([LocalesService], (localesService: LocalesService) => localesService.init())));

      it('Should use navigator\'s locale', inject([LocalesService], (localesService: LocalesService) => {
        expect(localesService.translate('foo')).toBe(locales.fr.foo);
      }));
    });
  });

  describe('When my browser is in other locale than english or french', () => {
    beforeEach(() => TestBed.configureTestingModule({
      imports: [
        SantechI18nModule.forRoot({
          localesProvider: {
            provide: LOCALES,
            useValue: locales,
          },
        }),
        TranslateModule.forRoot(),
        SantechPlatformModule.forRoot(),
      ],
      providers: [
        { provide: PLATFORM_NAVIGATOR, useValue: { language: 'es' } },
      ],
    }));

    describe('And locales Service is initiated', () => {
      beforeEach(async(inject([LocalesService], (localesService: LocalesService) => localesService.init())));

      it('Should use default fr locale', inject([LocalesService], (localesService: LocalesService) => {
        expect(localesService.translate('foo')).toBe(locales.fr.foo);
      }));
    });
  });
});
