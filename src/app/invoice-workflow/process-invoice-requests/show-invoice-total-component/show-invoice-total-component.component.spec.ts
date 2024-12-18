import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowInvoiceTotalComponentComponent } from './show-invoice-total-component.component';

describe('ShowInvoiceTotalComponentComponent', () => {
  let component: ShowInvoiceTotalComponentComponent;
  let fixture: ComponentFixture<ShowInvoiceTotalComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowInvoiceTotalComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowInvoiceTotalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
