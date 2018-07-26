import { InjectionToken } from '@angular/core';
import * as exifJs from 'exif-js';

export const EXIF = new InjectionToken<typeof exifJs>('exif');
