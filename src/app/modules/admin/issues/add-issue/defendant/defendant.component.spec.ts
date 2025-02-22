import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefendantComponent } from './defendant.component';

describe('DefendantComponent', () => {
  let component: DefendantComponent;
  let fixture: ComponentFixture<DefendantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefendantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefendantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
