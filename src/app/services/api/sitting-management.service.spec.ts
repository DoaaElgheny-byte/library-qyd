import { TestBed } from '@angular/core/testing';

import { SittingManagementService } from './sitting-management.service';

describe('SittingManagementService', () => {
  let service: SittingManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SittingManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
