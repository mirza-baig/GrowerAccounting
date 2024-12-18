import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerInvoiceListComponent } from './grower-invoice-list.component';

describe('GrowerInvoiceListComponent', () => {
  let component: GrowerInvoiceListComponent;
  let fixture: ComponentFixture<GrowerInvoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerInvoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
