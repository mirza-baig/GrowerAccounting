import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSearchActionsComponent } from './invoice-search-actions.component';

describe('InvoiceSearchActionsComponent', () => {
  let component: InvoiceSearchActionsComponent;
  let fixture: ComponentFixture<InvoiceSearchActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSearchActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSearchActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
