import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GLDistributionActionsComponent } from './gldistribution-actions.component';

describe('GLDistributionActionsComponent', () => {
  let component: GLDistributionActionsComponent;
  let fixture: ComponentFixture<GLDistributionActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GLDistributionActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GLDistributionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
