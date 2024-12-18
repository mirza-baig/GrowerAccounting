import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementInfoDetailPanelComponent } from './settlement-info-detail-panel.component';

describe('SettlementInfoDetailPanelComponent', () => {
  let component: SettlementInfoDetailPanelComponent;
  let fixture: ComponentFixture<SettlementInfoDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementInfoDetailPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementInfoDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
