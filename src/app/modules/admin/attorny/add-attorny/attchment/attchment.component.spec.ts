import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttchmentComponent } from './attchment.component';

describe('AttchmentComponent', () => {
  let component: AttchmentComponent;
  let fixture: ComponentFixture<AttchmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttchmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttchmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
