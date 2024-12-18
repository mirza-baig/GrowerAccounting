import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrowerMasterComponent } from './view-grower-master.component';

describe('ViewGrowerMasterComponent', () => {
  let component: ViewGrowerMasterComponent;
  let fixture: ComponentFixture<ViewGrowerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGrowerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrowerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
