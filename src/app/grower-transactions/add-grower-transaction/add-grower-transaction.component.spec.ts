import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrowerTransactionComponent } from './add-grower-transaction.component';

describe('AddGrowerTransactionComponent', () => {
  let component: AddGrowerTransactionComponent;
  let fixture: ComponentFixture<AddGrowerTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGrowerTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrowerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
