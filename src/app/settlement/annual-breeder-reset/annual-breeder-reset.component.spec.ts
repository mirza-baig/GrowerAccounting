import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualBreederResetComponent } from './annual-breeder-reset.component';

describe('AnnualBreederResetComponent', () => {
  let component: AnnualBreederResetComponent;
  let fixture: ComponentFixture<AnnualBreederResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualBreederResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualBreederResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
