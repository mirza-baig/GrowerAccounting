import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBatchListActionsComponent } from './invoice-batch-list-actions.component';

describe('InvoiceBatchListActionsComponent', () => {
  let component: InvoiceBatchListActionsComponent;
  let fixture: ComponentFixture<InvoiceBatchListActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBatchListActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBatchListActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
