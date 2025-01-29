import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPackageComponent } from './error-package.component';

describe('ErrorPackageComponent', () => {
  let component: ErrorPackageComponent;
  let fixture: ComponentFixture<ErrorPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorPackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
