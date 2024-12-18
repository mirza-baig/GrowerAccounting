import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBatchListComponent } from './invoice-batch-list.component';

describe('InvoiceBatchListComponent', () => {
  let component: InvoiceBatchListComponent;
  let fixture: ComponentFixture<InvoiceBatchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceBatchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
