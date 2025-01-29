import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoreBranchesComponent } from './view-more-branches.component';

describe('ViewMoreBranchesComponent', () => {
  let component: ViewMoreBranchesComponent;
  let fixture: ComponentFixture<ViewMoreBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMoreBranchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMoreBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
