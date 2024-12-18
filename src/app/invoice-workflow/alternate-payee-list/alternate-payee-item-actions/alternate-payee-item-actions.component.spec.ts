import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternatePayeeItemActionsComponent } from './alternate-payee-item-actions.component';

describe('AlternatePayeeItemActionsComponent', () => {
  let component: AlternatePayeeItemActionsComponent;
  let fixture: ComponentFixture<AlternatePayeeItemActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternatePayeeItemActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternatePayeeItemActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
