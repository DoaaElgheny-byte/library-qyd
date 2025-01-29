import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkdutyComponent } from './add-workduty.component';

describe('AddWorkdutyComponent', () => {
  let component: AddWorkdutyComponent;
  let fixture: ComponentFixture<AddWorkdutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkdutyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkdutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
