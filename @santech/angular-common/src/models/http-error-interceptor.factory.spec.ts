import { inject, TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { HttpErrorInterceptor } from '@santech/common';
import { SantechCommonModule } from '..';

describe('httpErrorInterceptorFactory', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      SantechPlatformModule.forRoot(),
      SantechCommonModule.forRoot(),
    ],
  }));

  it('Should provide HttpErrorInterceptors', inject([
    HttpErrorInterceptor,
  ], (httpErrorInterceptor: HttpErrorInterceptor) => {
    expect(httpErrorInterceptor instanceof HttpErrorInterceptor).toBe(true);
  }));
});
