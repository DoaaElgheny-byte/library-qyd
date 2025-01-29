import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttornyInfoComponent } from './attorny-info.component';

describe('AttornyInfoComponent', () => {
  let component: AttornyInfoComponent;
  let fixture: ComponentFixture<AttornyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttornyInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttornyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
