import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueWorkdutyComponent } from './issue-workduty.component';

describe('IssueWorkdutyComponent', () => {
  let component: IssueWorkdutyComponent;
  let fixture: ComponentFixture<IssueWorkdutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueWorkdutyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueWorkdutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
