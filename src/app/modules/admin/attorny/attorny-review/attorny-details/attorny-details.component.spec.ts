import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttornyDetailsComponent } from './attorny-details.component';

describe('AttornyDetailsComponent', () => {
  let component: AttornyDetailsComponent;
  let fixture: ComponentFixture<AttornyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttornyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttornyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
