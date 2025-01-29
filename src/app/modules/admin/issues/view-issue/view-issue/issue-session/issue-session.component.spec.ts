import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueSessionComponent } from './issue-session.component';

describe('IssueSessionComponent', () => {
  let component: IssueSessionComponent;
  let fixture: ComponentFixture<IssueSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
