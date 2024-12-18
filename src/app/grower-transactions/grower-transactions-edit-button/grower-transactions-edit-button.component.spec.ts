import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerTransactionsEditButtonComponent } from './grower-transactions-edit-button.component';

describe('GrowerTransactionsEditButtonComponent', () => {
  let component: GrowerTransactionsEditButtonComponent;
  let fixture: ComponentFixture<GrowerTransactionsEditButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerTransactionsEditButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerTransactionsEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
