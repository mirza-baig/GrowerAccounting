import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoiceBatchComponent } from './view-invoice-batch.component';

describe('ViewInvoiceBatchComponent', () => {
  let component: ViewInvoiceBatchComponent;
  let fixture: ComponentFixture<ViewInvoiceBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInvoiceBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvoiceBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
