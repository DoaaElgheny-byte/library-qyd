import { TestBed } from '@angular/core/testing';

import { WorkDutyService } from './work-duty.service';

describe('WorkDutyService', () => {
  let service: WorkDutyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkDutyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
