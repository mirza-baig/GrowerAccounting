import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRequestApprovalActionsComponent } from './invoice-request-approval-actions.component';

describe('InvoiceRequestApprovalActionsComponent', () => {
  let component: InvoiceRequestApprovalActionsComponent;
  let fixture: ComponentFixture<InvoiceRequestApprovalActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceRequestApprovalActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceRequestApprovalActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
