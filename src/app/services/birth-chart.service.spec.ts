import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { BirthChartService } from './weekly-component.service';

describe('BirthChartService', () => {
  let service: BirthChartService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(BirthChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a BirthChart when the API returns data', () => {
    const id = 1;
    const mockResponse = {
      id: 1,
      userid: 1,
      dateofbirth: "dummy date of birth",
      placeofbirth: "dummy place of birth",
      chart: "dummy chart",
    };
    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getBirthChartByUserId(id).subscribe((result) => {
      expect(result).toEqual(mockResponse);
    });
  });
});

