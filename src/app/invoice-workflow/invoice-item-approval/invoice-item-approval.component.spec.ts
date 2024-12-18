import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemApprovalComponent } from './invoice-item-approval.component';

describe('InvoiceItemApprovalComponent', () => {
  let component: InvoiceItemApprovalComponent;
  let fixture: ComponentFixture<InvoiceItemApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceItemApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
