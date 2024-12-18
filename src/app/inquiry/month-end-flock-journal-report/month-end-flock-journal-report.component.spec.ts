import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthEndFlockJournalReportComponent } from './month-end-flock-journal-report.component';

describe('MonthEndFlockJournalReportComponent', () => {
  let component: MonthEndFlockJournalReportComponent;
  let fixture: ComponentFixture<MonthEndFlockJournalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthEndFlockJournalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthEndFlockJournalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
