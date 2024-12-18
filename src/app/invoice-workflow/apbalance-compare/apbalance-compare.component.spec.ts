import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { APBalanceCompareComponent } from './apbalance-compare.component';

describe('APBalanceCompareComponent', () => {
  let component: APBalanceCompareComponent;
  let fixture: ComponentFixture<APBalanceCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ APBalanceCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(APBalanceCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
