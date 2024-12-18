import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsActionButtonsComponent } from './transactions-action-buttons.component';

describe('TransactionsActionButtonsComponent', () => {
  let component: TransactionsActionButtonsComponent;
  let fixture: ComponentFixture<TransactionsActionButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsActionButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
