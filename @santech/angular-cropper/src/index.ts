import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { SantechPicaModule } from '@santech/angular-pica';
import { ResizeService } from './services/resize.service';
import { IMG_MAX_HEIGHT, IMG_MAX_WIDTH } from './tokens/image-options';
import { IMG_REGEX } from './tokens/image-regex';

export * from './services/resize.service';
export * from './tokens/image-options';
export * from './tokens/image-regex';

export function imgRegExFactory() {
  return new RegExp('\.(png|jpe?g|gif)$', 'i');
}

export interface ISantechCropperModuleConfiguration {
  imgRegEx?: Provider;
  imgMaxHeigth?: Provider;
  imgMaxWidth?: Provider;
}

@NgModule({
  imports: [
    SantechPicaModule.forChild(),
  ],
})
export class SantechCropperModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechCropperModule,
    };
  }

  public static forRoot(config: ISantechCropperModuleConfiguration = {}): ModuleWithProviders {
    return {
      ngModule: SantechCropperModule,
      providers: [
        ResizeService,
        config.imgRegEx
          ? config.imgRegEx
          : {
            provide: IMG_REGEX,
            useFactory: imgRegExFactory,
          },
        config.imgMaxHeigth
          ? config.imgMaxHeigth
          : {
            provide: IMG_MAX_HEIGHT,
            useValue: 1920,
          },
        config.imgMaxWidth
          ? config.imgMaxWidth
          : {
            provide: IMG_MAX_WIDTH,
            useValue: 1920,
          },
      ],
    };
  }
}
