import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStorageComponent } from './custom-storage.component';

describe('CustomStorageComponent', () => {
  let component: CustomStorageComponent;
  let fixture: ComponentFixture<CustomStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CustomStorageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
