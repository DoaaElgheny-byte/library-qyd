import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SittingInfoComponent } from './sitting-info.component';

describe('SittingInfoComponent', () => {
  let component: SittingInfoComponent;
  let fixture: ComponentFixture<SittingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SittingInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SittingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
