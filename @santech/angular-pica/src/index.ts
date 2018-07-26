import { ModuleWithProviders, NgModule } from '@angular/core';
import { ISantechPicaModuleConfiguration } from './interfaces/configuration';
import { exifFactory } from './models/exif.factory';
import { picaFactory } from './models/pica.factory';
import { PicaCanvasService } from './services/pica-canvas.service';
import { PicaExifService } from './services/pica-exif.service';
import { PicaImageService } from './services/pica-image.service';
import { PicaService } from './services/pica.service';
import { EXIF } from './tokens/exif.token';
import { PICA } from './tokens/pica.token';

export * from './interfaces/input';
export * from './interfaces/param';
export * from './models/exif.factory';
export * from './models/pica.factory';
export * from './services/pica-canvas.service';
export * from './services/pica-exif.service';
export * from './services/pica-image.service';
export * from './services/pica.service';
export * from './tokens/exif.token';
export * from './tokens/pica.token';

@NgModule()
export class SantechPicaModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechPicaModule,
    };
  }

  public static forRoot(config: ISantechPicaModuleConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: SantechPicaModule,
      providers: [
        PicaCanvasService,
        PicaExifService,
        PicaImageService,
        PicaService,
        config.exifProvider
          ? config.exifProvider
          : {
            provide: EXIF,
            useFactory: exifFactory,
          },
        config.picaProvider
          ? config.picaProvider
          : {
            provide: PICA,
            useFactory: picaFactory,
          },
      ],
    };
  }
}
