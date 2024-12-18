import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowContactManagementComponent } from './workflow-contact-management.component';

describe('WorkflowContactManagementComponent', () => {
  let component: WorkflowContactManagementComponent;
  let fixture: ComponentFixture<WorkflowContactManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowContactManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowContactManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
