import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInvoiceBatchListComponent } from './process-invoice-batch-list.component';

describe('ProcessInvoiceBatchListComponent', () => {
  let component: ProcessInvoiceBatchListComponent;
  let fixture: ComponentFixture<ProcessInvoiceBatchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessInvoiceBatchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInvoiceBatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
