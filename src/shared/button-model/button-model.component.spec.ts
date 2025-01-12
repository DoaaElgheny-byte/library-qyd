import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonModelComponent } from './button-model.component';

describe('ButtonModelComponent', () => {
  let component: ButtonModelComponent;
  let fixture: ComponentFixture<ButtonModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ButtonModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
