import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBatchApprovalComponent } from './invoice-batch-approval.component';

describe('InvoiceBatchApprovalComponent', () => {
  let component: InvoiceBatchApprovalComponent;
  let fixture: ComponentFixture<InvoiceBatchApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBatchApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBatchApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
