import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxPicaModule } from 'ngx-pica';
import { IMG_MAX_HEIGHT, IMG_MAX_WIDTH } from '.';
import { ImageService } from './services/image.service';
import { IMG_REGEX } from './tokens/image-regex';

export * from './services/image.service';
export * from './interfaces/images';
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
    NgxPicaModule,
  ],
})
export class SantechCropperModule {
  public static forChild(): ModuleWithProviders {
    return {
      ngModule: SantechCropperModule,
    };
  }

  public static forRoot({
      imgRegEx,
      imgMaxHeigth,
      imgMaxWidth,
    }: ISantechCropperModuleConfiguration = {},
  ): ModuleWithProviders {
    return {
      ngModule: SantechCropperModule,
      providers: [
        ImageService,
        imgRegEx
          ? imgRegEx
          : {
            provide: IMG_REGEX,
            useFactory: imgRegExFactory,
          },
        imgMaxHeigth
          ? imgMaxHeigth
          : {
            provide: IMG_MAX_HEIGHT,
            useValue: 1920,
          },
        imgMaxWidth
          ? imgMaxWidth
          : {
            provide: IMG_MAX_WIDTH,
            useValue: 1920,
          },
      ],
    };
  }
}
