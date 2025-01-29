import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDutyAttachmentComponent } from './work-duty-attachment.component';

describe('WorkDutyAttachmentComponent', () => {
  let component: WorkDutyAttachmentComponent;
  let fixture: ComponentFixture<WorkDutyAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkDutyAttachmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkDutyAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
