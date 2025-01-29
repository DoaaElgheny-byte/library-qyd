import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllWorkdutyComponent } from './add-all-workduty.component';

describe('AddAllWorkdutyComponent', () => {
  let component: AddAllWorkdutyComponent;
  let fixture: ComponentFixture<AddAllWorkdutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAllWorkdutyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAllWorkdutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
