import { CropperSettings } from 'ngx-img-cropper';

export interface ICropperImage extends HTMLImageElement {
  image?: string | null | undefined;
}

export type TCropperSettingsFactory = (image?: ICropperImage) => CropperSettings;
