import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerSelectActionComponent } from './grower-select-action.component';

describe('GrowerSelectActionComponent', () => {
  let component: GrowerSelectActionComponent;
  let fixture: ComponentFixture<GrowerSelectActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowerSelectActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowerSelectActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
