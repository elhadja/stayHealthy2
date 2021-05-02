import { TestBed } from '@angular/core/testing';

import { DoctorApiService } from './doctorApi.service';

describe('Doctor.ApiService', () => {
  let service: DoctorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
