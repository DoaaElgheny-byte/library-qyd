import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorkdutyComponent } from './view-workduty.component';

describe('ViewWorkdutyComponent', () => {
  let component: ViewWorkdutyComponent;
  let fixture: ComponentFixture<ViewWorkdutyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorkdutyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWorkdutyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
