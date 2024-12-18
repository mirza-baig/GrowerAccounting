import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerTransactionsComponent } from './grower-transactions.component';

describe('GrowerTransactionsComponent', () => {
  let component: GrowerTransactionsComponent;
  let fixture: ComponentFixture<GrowerTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
