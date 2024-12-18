import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekEndingDatePickerComponent } from './week-ending-date-picker.component';

describe('WeekEndingDatePickerComponent', () => {
  let component: WeekEndingDatePickerComponent;
  let fixture: ComponentFixture<WeekEndingDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekEndingDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekEndingDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
