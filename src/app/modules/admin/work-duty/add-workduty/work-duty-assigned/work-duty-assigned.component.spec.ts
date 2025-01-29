import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDutyAssignedComponent } from './work-duty-assigned.component';

describe('WorkDutyAssignedComponent', () => {
  let component: WorkDutyAssignedComponent;
  let fixture: ComponentFixture<WorkDutyAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkDutyAssignedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkDutyAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
