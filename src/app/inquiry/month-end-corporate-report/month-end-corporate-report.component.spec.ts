import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthEndCorporateReportComponent } from './month-end-corporate-report.component';

describe('MonthEndCorporateReportComponent', () => {
  let component: MonthEndCorporateReportComponent;
  let fixture: ComponentFixture<MonthEndCorporateReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthEndCorporateReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthEndCorporateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
