import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestBatchItemActionsComponent } from './payment-request-batch-item-actions.component';

describe('PaymentRequestBatchItemActionsComponent', () => {
  let component: PaymentRequestBatchItemActionsComponent;
  let fixture: ComponentFixture<PaymentRequestBatchItemActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRequestBatchItemActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRequestBatchItemActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
