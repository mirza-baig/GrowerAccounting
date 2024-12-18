import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowContactActionsComponent } from './workflow-contact-actions.component';

describe('WorkflowContactActionsComponent', () => {
  let component: WorkflowContactActionsComponent;
  let fixture: ComponentFixture<WorkflowContactActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowContactActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowContactActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
