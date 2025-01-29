import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPaymentsComponent } from './agent-payments.component';

describe('AgentPaymentsComponent', () => {
  let component: AgentPaymentsComponent;
  let fixture: ComponentFixture<AgentPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
