import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueManagementComponent } from './issue-management.component';

describe('IssueManagementComponent', () => {
  let component: IssueManagementComponent;
  let fixture: ComponentFixture<IssueManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
