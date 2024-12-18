import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoicePaymentRequestComponent } from './view-invoice-payment-request.component';

describe('ViewInvoicePaymentRequestComponent', () => {
  let component: ViewInvoicePaymentRequestComponent;
  let fixture: ComponentFixture<ViewInvoicePaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInvoicePaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvoicePaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
