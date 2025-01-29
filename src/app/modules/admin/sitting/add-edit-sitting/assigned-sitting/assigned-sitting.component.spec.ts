import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedSittingComponent } from './assigned-sitting.component';

describe('AssignedSittingComponent', () => {
  let component: AssignedSittingComponent;
  let fixture: ComponentFixture<AssignedSittingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedSittingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
