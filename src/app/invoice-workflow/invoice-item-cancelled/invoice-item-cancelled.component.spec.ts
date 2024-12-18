import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceItemCancelledComponent } from './invoice-item-cancelled.component';

describe('InvoiceItemCancelledComponent', () => {
  let component: InvoiceItemCancelledComponent;
  let fixture: ComponentFixture<InvoiceItemCancelledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceItemCancelledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceItemCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
