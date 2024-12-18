import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInvoiceRequestsComponent } from './process-invoice-requests.component';

describe('ProcessInvoiceRequestsComponent', () => {
  let component: ProcessInvoiceRequestsComponent;
  let fixture: ComponentFixture<ProcessInvoiceRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessInvoiceRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInvoiceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
