import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerInvoiceListActionsComponent } from './grower-invoice-list-actions.component';

describe('GrowerInvoiceListActionsComponent', () => {
  let component: GrowerInvoiceListActionsComponent;
  let fixture: ComponentFixture<GrowerInvoiceListActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerInvoiceListActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerInvoiceListActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
