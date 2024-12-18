import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentRequestViewPanelComponent } from './invoice-payment-request-view-panel.component';

describe('InvoicePaymentRequestViewPanelComponent', () => {
  let component: InvoicePaymentRequestViewPanelComponent;
  let fixture: ComponentFixture<InvoicePaymentRequestViewPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePaymentRequestViewPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaymentRequestViewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
