import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SantechPlatformModule } from '@santech/angular-platform';
import { Http, THttpRequestInterceptor } from '@santech/core';
import { spyHttp } from '@santech/core/testing';
import { APP_INFORMATION, SantechCommonModule } from '..';

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
  let interceptor: THttpRequestInterceptor;
  let fixture: ComponentFixture<TestAddHeaderVersionComponent>;

  beforeEach(async(() => {
    spyHttp.addRequestInterceptor.mockImplementation((func: THttpRequestInterceptor) => {
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
    interceptor('', { headers });
    expect(headers.get('Version')).toBe('name-version');
    fixture.destroy();
    expect(spyRemover).toHaveBeenCalled();
  });
});
