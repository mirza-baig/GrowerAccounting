import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementBatchListComponent } from './settlement-batch-list.component';

describe('SettlementBatchListComponent', () => {
  let component: SettlementBatchListComponent;
  let fixture: ComponentFixture<SettlementBatchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementBatchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementBatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
