import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSettlementBatchComponent } from './view-settlement-batch.component';

describe('ViewSettlementBatchComponent', () => {
  let component: ViewSettlementBatchComponent;
  let fixture: ComponentFixture<ViewSettlementBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSettlementBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSettlementBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
