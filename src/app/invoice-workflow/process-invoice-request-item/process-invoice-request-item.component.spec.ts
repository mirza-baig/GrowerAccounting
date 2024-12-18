import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessInvoiceRequestItemComponent } from './process-invoice-request-item.component';

describe('ProcessInvoiceRequestItemComponent', () => {
  let component: ProcessInvoiceRequestItemComponent;
  let fixture: ComponentFixture<ProcessInvoiceRequestItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessInvoiceRequestItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessInvoiceRequestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
