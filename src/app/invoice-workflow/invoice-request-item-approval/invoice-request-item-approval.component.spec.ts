import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRequestItemApprovalComponent } from './invoice-request-item-approval.component';

describe('InvoiceRequestItemApprovalComponent', () => {
  let component: InvoiceRequestItemApprovalComponent;
  let fixture: ComponentFixture<InvoiceRequestItemApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceRequestItemApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceRequestItemApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
