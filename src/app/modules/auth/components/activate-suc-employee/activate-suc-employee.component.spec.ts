import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateSucEmployeeComponent } from './activate-suc-employee.component';

describe('ActivateSucEmployeeComponent', () => {
  let component: ActivateSucEmployeeComponent;
  let fixture: ComponentFixture<ActivateSucEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateSucEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateSucEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
