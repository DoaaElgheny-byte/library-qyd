import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDutyComponent } from './work-duty.component';

describe('WorkDutyComponent', () => {
  let component: WorkDutyComponent;
  let fixture: ComponentFixture<WorkDutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkDutyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkDutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
