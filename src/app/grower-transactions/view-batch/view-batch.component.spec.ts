import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBatchComponent } from './view-batch.component';

describe('ViewBatchComponent', () => {
  let component: ViewBatchComponent;
  let fixture: ComponentFixture<ViewBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
