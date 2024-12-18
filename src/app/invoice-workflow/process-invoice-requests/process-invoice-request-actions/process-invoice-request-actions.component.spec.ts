import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInvoiceRequestActionsComponent } from './process-invoice-request-actions.component';

describe('ProcessInvoiceRequestActionsComponent', () => {
  let component: ProcessInvoiceRequestActionsComponent;
  let fixture: ComponentFixture<ProcessInvoiceRequestActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessInvoiceRequestActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInvoiceRequestActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
