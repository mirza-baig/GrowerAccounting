import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerSelectionPanelComponent } from './grower-selection-panel.component';

describe('GrowerSelectionPanelComponent', () => {
  let component: GrowerSelectionPanelComponent;
  let fixture: ComponentFixture<GrowerSelectionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerSelectionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerSelectionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
