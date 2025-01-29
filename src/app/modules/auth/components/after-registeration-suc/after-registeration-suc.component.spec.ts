import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterRegisterationSucComponent } from './after-registeration-suc.component';

describe('AfterRegisterationSucComponent', () => {
  let component: AfterRegisterationSucComponent;
  let fixture: ComponentFixture<AfterRegisterationSucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterRegisterationSucComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterRegisterationSucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
