import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDistributionActionsComponent } from './farm-distribution-actions.component';

describe('FarmDistributionActionsComponent', () => {
  let component: FarmDistributionActionsComponent;
  let fixture: ComponentFixture<FarmDistributionActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmDistributionActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDistributionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
