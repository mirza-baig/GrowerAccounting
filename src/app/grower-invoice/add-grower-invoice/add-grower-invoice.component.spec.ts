import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrowerInvoiceComponent } from './add-grower-invoice.component';

describe('AddGrowerInvoiceComponent', () => {
  let component: AddGrowerInvoiceComponent;
  let fixture: ComponentFixture<AddGrowerInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGrowerInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrowerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
