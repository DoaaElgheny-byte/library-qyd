import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttorntManagmentComponent } from './attornt-managment.component';

describe('AttorntManagmentComponent', () => {
  let component: AttorntManagmentComponent;
  let fixture: ComponentFixture<AttorntManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttorntManagmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttorntManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
