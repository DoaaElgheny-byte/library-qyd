import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSittingComponent } from './manage-sitting.component';

describe('ManageSittingComponent', () => {
  let component: ManageSittingComponent;
  let fixture: ComponentFixture<ManageSittingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSittingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
