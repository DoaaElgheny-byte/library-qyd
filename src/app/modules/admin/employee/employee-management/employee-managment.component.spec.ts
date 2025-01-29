import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeManagmentComponent } from './employee-managment.component';

describe('EmployeeManagmentComponent', () => {
  let component: EmployeeManagmentComponent;
  let fixture: ComponentFixture<EmployeeManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeManagmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
