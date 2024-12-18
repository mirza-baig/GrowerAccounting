import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementListTransferButtonComponent } from './settlement-list-transfer-button.component';

describe('SettlementListTransferButtonComponent', () => {
  let component: SettlementListTransferButtonComponent;
  let fixture: ComponentFixture<SettlementListTransferButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementListTransferButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementListTransferButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
