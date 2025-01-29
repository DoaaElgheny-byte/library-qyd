import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDtyReviewComponent } from './work-dty-review.component';

describe('WorkDtyReviewComponent', () => {
  let component: WorkDtyReviewComponent;
  let fixture: ComponentFixture<WorkDtyReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkDtyReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkDtyReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
