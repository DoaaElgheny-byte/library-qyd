import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttornyComponent } from './add-attorny.component';

describe('AddAttornyComponent', () => {
  let component: AddAttornyComponent;
  let fixture: ComponentFixture<AddAttornyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAttornyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAttornyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
