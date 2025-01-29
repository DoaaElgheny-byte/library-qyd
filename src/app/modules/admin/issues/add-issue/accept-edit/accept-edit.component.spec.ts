import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptEditComponent } from './accept-edit.component';

describe('AcceptEditComponent', () => {
  let component: AcceptEditComponent;
  let fixture: ComponentFixture<AcceptEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
