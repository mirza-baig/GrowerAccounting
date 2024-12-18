import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSettlementPanelComponent } from './select-settlement-panel.component';

describe('SelectSettlementPanelComponent', () => {
  let component: SelectSettlementPanelComponent;
  let fixture: ComponentFixture<SelectSettlementPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSettlementPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSettlementPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
