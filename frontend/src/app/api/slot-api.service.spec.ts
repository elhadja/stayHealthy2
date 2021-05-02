import { TestBed } from '@angular/core/testing';

import { SlotApiService } from './slot-api.service';

describe('SlotApiService', () => {
  let service: SlotApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlotApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
