import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoicePaymentRequestComponent } from './add-invoice-payment-request.component';

describe('AddInvoicePaymentRequestComponent', () => {
  let component: AddInvoicePaymentRequestComponent;
  let fixture: ComponentFixture<AddInvoicePaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInvoicePaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInvoicePaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
