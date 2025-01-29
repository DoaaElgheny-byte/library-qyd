import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSittingComponent } from './review-sitting.component';

describe('ReviewSittingComponent', () => {
  let component: ReviewSittingComponent;
  let fixture: ComponentFixture<ReviewSittingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSittingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
