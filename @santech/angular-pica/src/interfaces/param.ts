import { TPicaInput } from './input';

export interface IPicaResizeParams<T extends TPicaInput> {
  data: T;
  width: number;
  height: number;
}

export interface IPicaAspectRatioOptions {
  keepAspectRatio: boolean;
  forceMinDimensions?: boolean;
}

export interface IPicaResizeOptions {
  aspectRatio?: IPicaAspectRatioOptions;
  quality?: number;
  alpha?: boolean;
  unsharpAmount?: number;
  unsharpRadius?: number;
  unsharpThreshold?: number;
}

export interface IPicaResizeCanvas<T extends TPicaInput> {
  data: T;
  from: HTMLCanvasElement;
  to: HTMLCanvasElement;
}
