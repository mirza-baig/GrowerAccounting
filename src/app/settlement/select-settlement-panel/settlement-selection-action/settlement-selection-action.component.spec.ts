import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementSelectionActionComponent } from './settlement-selection-action.component';

describe('SettlementSelectionActionComponent', () => {
  let component: SettlementSelectionActionComponent;
  let fixture: ComponentFixture<SettlementSelectionActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementSelectionActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementSelectionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
