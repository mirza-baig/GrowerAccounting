import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInquiryComponent } from './account-inquiry.component';

describe('AccountInquiryComponent', () => {
  let component: AccountInquiryComponent;
  let fixture: ComponentFixture<AccountInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
