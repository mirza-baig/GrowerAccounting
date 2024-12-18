import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementBatchActionsComponent } from './settlement-batch-actions.component';

describe('SettlementBatchActionsComponent', () => {
  let component: SettlementBatchActionsComponent;
  let fixture: ComponentFixture<SettlementBatchActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementBatchActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementBatchActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
