import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementListEditButtonComponent } from './settlement-list-edit-button.component';

describe('SettlementListEditButtonComponent', () => {
  let component: SettlementListEditButtonComponent;
  let fixture: ComponentFixture<SettlementListEditButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementListEditButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementListEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
