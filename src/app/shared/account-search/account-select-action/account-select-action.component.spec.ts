import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectActionComponent } from './account-select-action.component';

describe('AccountSelectActionComponent', () => {
  let component: AccountSelectActionComponent;
  let fixture: ComponentFixture<AccountSelectActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
