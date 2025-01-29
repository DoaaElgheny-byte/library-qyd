/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppConfirmService } from './app-confirm.service';

describe('Service: AppConfirm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfirmService]
    });
  });

  it('should ...', inject([AppConfirmService], (service: AppConfirmService) => {
    expect(service).toBeTruthy();
  }));
});
