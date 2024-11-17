import { TestBed } from '@angular/core/testing';

import { SharedStatusService } from './shared-status.service';

describe('SharedStatusService', () => {
  let service: SharedStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
