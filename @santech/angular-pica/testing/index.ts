import { PicaCanvasService, PicaExifService, PicaImageService, PicaService } from '@santech/angular-pica';
import { createJestSpyObj, filterPrivate, SantechSpyObject } from '@santech/core/testing';

export const picaCanvasServiceMethods = Object
  .getOwnPropertyNames(PicaCanvasService.prototype).filter(filterPrivate);

export const picaExifServiceMethods = Object
  .getOwnPropertyNames(PicaExifService.prototype).filter(filterPrivate);

export const picaImageServiceMethods = Object
  .getOwnPropertyNames(PicaImageService.prototype).filter(filterPrivate);

export const picaServiceMethods = Object
  .getOwnPropertyNames(PicaService.prototype).filter(filterPrivate);

export const spyDocument = {
  createElement: jest.fn(),
};

spyDocument.createElement
  .mockImplementation((tag) => tag === 'canvas' ? spyCanvas : null);

export const spyCanvas: SantechSpyObject<HTMLCanvasElement> = {
  getContext: jest.fn(),
  toDataURL: jest.fn(),
} as any;

export const spyCtx: SantechSpyObject<CanvasRenderingContext2D> = {
  drawImage: jest.fn(),
  getImageData: jest.fn(),
  transform: jest.fn(),
} as any;

spyCanvas.getContext
  .mockImplementation((ctx) => ctx === '2d' ? spyCtx : null);

export const spyExif = {
  getAllTags: jest.fn(),
  getData: jest.fn(),
};

export const spyPica = {
  resize: jest.fn(),
  toBlob: jest.fn(),
};

let spyPicaCanvasService: SantechSpyObject<PicaCanvasService>;
let spyPicaExifService: SantechSpyObject<PicaExifService>;
let spyPicaImageService: SantechSpyObject<PicaImageService>;
let spyPicaService: SantechSpyObject<PicaService>;

if (typeof jasmine !== 'undefined' && typeof jasmine.createSpyObj === 'function') {
  spyPicaCanvasService = jasmine.createSpyObj('spyPicaCanvasService', picaCanvasServiceMethods);
  spyPicaExifService = jasmine.createSpyObj('spyPicaExifService', picaExifServiceMethods);
  spyPicaImageService = jasmine.createSpyObj('spyPicaImageService', picaImageServiceMethods);
  spyPicaService = jasmine.createSpyObj('spyPicaService', picaServiceMethods);
} else if (typeof jest !== 'undefined') {
  spyPicaCanvasService = createJestSpyObj(picaCanvasServiceMethods);
  spyPicaExifService = createJestSpyObj(picaExifServiceMethods);
  spyPicaImageService = createJestSpyObj(picaImageServiceMethods);
  spyPicaService = createJestSpyObj(picaServiceMethods);
}

export {
  spyPicaCanvasService,
  spyPicaExifService,
  spyPicaImageService,
  spyPicaService,
};
