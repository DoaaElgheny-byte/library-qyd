import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkdutyDetailsComponent } from './workduty-details.component';

describe('WorkdutyDetailsComponent', () => {
  let component: WorkdutyDetailsComponent;
  let fixture: ComponentFixture<WorkdutyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkdutyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkdutyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
