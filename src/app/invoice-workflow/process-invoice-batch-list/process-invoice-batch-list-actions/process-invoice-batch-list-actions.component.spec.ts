import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInvoiceBatchListActionsComponent } from './process-invoice-batch-list-actions.component';

describe('ProcessInvoiceBatchListActionsComponent', () => {
  let component: ProcessInvoiceBatchListActionsComponent;
  let fixture: ComponentFixture<ProcessInvoiceBatchListActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessInvoiceBatchListActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInvoiceBatchListActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
