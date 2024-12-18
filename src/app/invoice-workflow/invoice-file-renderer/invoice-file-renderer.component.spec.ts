import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFileRendererComponent } from './invoice-file-renderer.component';

describe('InvoiceFileRendererComponent', () => {
  let component: InvoiceFileRendererComponent;
  let fixture: ComponentFixture<InvoiceFileRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFileRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFileRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
