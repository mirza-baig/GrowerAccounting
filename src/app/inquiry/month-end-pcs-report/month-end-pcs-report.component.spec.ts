import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthEndPcsReportComponent } from './month-end-pcs-report.component';

describe('MonthEndPcsReportComponent', () => {
  let component: MonthEndPcsReportComponent;
  let fixture: ComponentFixture<MonthEndPcsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthEndPcsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthEndPcsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
