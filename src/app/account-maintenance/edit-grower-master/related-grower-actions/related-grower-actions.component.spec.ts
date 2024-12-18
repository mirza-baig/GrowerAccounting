import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedGrowerActionsComponent } from './related-grower-actions.component';

describe('RelatedGrowerActionsComponent', () => {
  let component: RelatedGrowerActionsComponent;
  let fixture: ComponentFixture<RelatedGrowerActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedGrowerActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedGrowerActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
