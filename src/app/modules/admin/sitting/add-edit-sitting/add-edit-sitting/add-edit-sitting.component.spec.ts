import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSittingComponent } from './add-edit-sitting.component';

describe('AddEditSittingComponent', () => {
  let component: AddEditSittingComponent;
  let fixture: ComponentFixture<AddEditSittingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSittingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
