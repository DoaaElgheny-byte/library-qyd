import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDutyInfoComponent } from './work-duty-info.component';

describe('WorkDutyInfoComponent', () => {
  let component: WorkDutyInfoComponent;
  let fixture: ComponentFixture<WorkDutyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkDutyInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkDutyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
