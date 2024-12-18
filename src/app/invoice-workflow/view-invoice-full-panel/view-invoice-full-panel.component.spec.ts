import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoiceFullPanelComponent } from './view-invoice-full-panel.component';

describe('ViewInvoiceFullPanelComponent', () => {
  let component: ViewInvoiceFullPanelComponent;
  let fixture: ComponentFixture<ViewInvoiceFullPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInvoiceFullPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInvoiceFullPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
