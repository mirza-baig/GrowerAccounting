import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditInquiryComponent } from './credit-inquiry.component';

describe('CreditInquiryComponent', () => {
  let component: CreditInquiryComponent;
  let fixture: ComponentFixture<CreditInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
