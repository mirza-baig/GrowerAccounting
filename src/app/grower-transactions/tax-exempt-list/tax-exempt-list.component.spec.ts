import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxExemptListComponent } from './tax-exempt-list.component';

describe('TaxExemptListComponent', () => {
  let component: TaxExemptListComponent;
  let fixture: ComponentFixture<TaxExemptListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxExemptListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxExemptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
