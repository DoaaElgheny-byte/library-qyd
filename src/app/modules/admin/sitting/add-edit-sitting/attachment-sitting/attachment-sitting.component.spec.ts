import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentSittingComponent } from './attachment-sitting.component';

describe('AttachmentSittingComponent', () => {
  let component: AttachmentSittingComponent;
  let fixture: ComponentFixture<AttachmentSittingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentSittingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
