import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Http, IHttpInterceptor } from '@santech/core';
import { spyHttp } from '@santech/core/testing';
import { SantechCommonModule } from '..';
import { APP_INFORMATION } from '../tokens/app-information.token';

@Component({
  selector: 'test-add-header-version',
  template: `
    <div add-header-version></div>
  `,
})
class TestAddHeaderVersionComponent { }

describe('AddHeaderVersionDirective', () => {
  const spyRemover = jest.fn();
  const headers = new Headers();
  let interceptor: IHttpInterceptor;
  let fixture: ComponentFixture<TestAddHeaderVersionComponent>;

  beforeEach(async(() => {
    spyHttp.addInterceptor.mockImplementation((func: IHttpInterceptor) => {
      interceptor = func;
      return spyRemover;
    });
    spyHttp.createHeaders.mockImplementation(() => headers);

    fixture = TestBed.configureTestingModule({
      declarations: [
        TestAddHeaderVersionComponent,
      ],
      imports: [
        SantechPlatformModule.forRoot(),
        SantechCommonModule.forRoot({
          appInformationProvider: {
            provide: APP_INFORMATION,
            useValue: {
              name: 'name',
              version: 'version',
            },
          },
        }),
      ],
      providers: [
        { provide: Http, useValue: spyHttp },
      ],
    })
      .createComponent(TestAddHeaderVersionComponent);
    fixture.autoDetectChanges();
  }));

  it('Should set header version request interceptor', () => {
    const { request } = interceptor;
    if (!request) {
      throw new Error('Bad interceptor');
    }
    request('', { headers });
    expect(headers.get('Version')).toBe('name-version');
    fixture.destroy();
    expect(spyRemover).toHaveBeenCalled();
  });
});
