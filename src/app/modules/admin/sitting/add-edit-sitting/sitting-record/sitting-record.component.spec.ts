import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SittingRecordComponent } from './sitting-record.component';

describe('SittingRecordComponent', () => {
  let component: SittingRecordComponent;
  let fixture: ComponentFixture<SittingRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SittingRecordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SittingRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
