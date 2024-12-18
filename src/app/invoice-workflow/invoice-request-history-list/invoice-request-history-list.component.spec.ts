import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRequestHistoryListComponent } from './invoice-request-history-list.component';

describe('InvoiceRequestHistoryListComponent', () => {
  let component: InvoiceRequestHistoryListComponent;
  let fixture: ComponentFixture<InvoiceRequestHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceRequestHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceRequestHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
