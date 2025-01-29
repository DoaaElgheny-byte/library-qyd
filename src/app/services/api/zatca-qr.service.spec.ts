import { TestBed } from '@angular/core/testing';

import { ZatcaQrService } from './zatca-qr.service';

describe('ZatcaQrService', () => {
  let service: ZatcaQrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZatcaQrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
